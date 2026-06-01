import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Anthropic from '@anthropic-ai/sdk'
import { getMembershipByUser } from '@/lib/airtable/memberships'
import base, { Tables } from '@/lib/airtable/client'

const FREE_PROMPT_LIMIT = 10

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are an expert web builder AI. Generate complete, self-contained HTML pages based on user descriptions.

CRITICAL OUTPUT RULE: Return ONLY raw HTML starting with <!DOCTYPE html>. No markdown, no code fences, no explanation. The response must start with <!DOCTYPE html> and nothing else.

DEFAULT PAGE STRUCTURE (use unless user specifies otherwise):
- Header: 15vh height, contains logo/title + responsive navigation
- Content area: flex-grow, split into rows as the user describes
- Footer: 15vh height

RESPONSIVE NAVIGATION (always include):
- Desktop (≥768px): horizontal nav links in header
- Mobile (<768px): hamburger icon (☰) that toggles a dropdown nav
- Implement with pure CSS + minimal inline JS (no external libraries)

COLUMN DIVIDER SYSTEM:
When user says "divide [area/row] into N columns":
- Use CSS Grid: grid-template-columns: repeat(N, 1fr)
- Each column has a centered "+" button styled as a dashed-border placeholder zone
- "+" buttons use: border: 2px dashed rgba(100,100,255,0.3); border-radius:8px; padding:20px; cursor:pointer; opacity:0.5
- On hover: opacity:1, border-color brightens

ELEMENT TYPES users can add via "+" zones:
- Text: heading (h1-h4), paragraph, caption — with custom font/size/color
- Button: clickable with custom label, color, size, border-radius
- Image: with width/height/alt, grey placeholder if no src
- Form: contact form with name/email/message + submit
- Input: single input field with type/placeholder/label
- Dropdown: select element with options
- Email signup: email input + subscribe button
- Navigation menu: header nav links

STYLING RULES:
- All CSS in a <style> tag in <head> + inline styles where needed
- CSS custom properties for theme: --bg, --text, --accent, --border
- Smooth transitions on hover/focus (transition: all 0.2s ease)
- Clean modern typography: use system-ui or a Google Font via @import
- Apply exact colors/fonts/sizes the user specifies
- Default color scheme: dark (#0a0a0f bg, #f0f0f0 text, #4ade80 accent)

WHEN USER MODIFIES EXISTING PAGE:
- Keep the entire existing page structure
- Apply only the requested change
- Do not remove content the user didn't mention

WHEN /clean WAS USED (fresh start):
- Start from the default layout structure above
- Apply user's description on top of it`

interface ClaudeMsg {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const membership = await getMembershipByUser(userId).catch(() => null)
  const isPro = membership?.status === 'active'

  let promptsUsed = 0
  if (!isPro) {
    const records = await base()(Tables.AI_PROJECTS)
      .select({ filterByFormula: `{owner_id}='${userId}'`, fields: ['owner_id'] })
      .all()
      .catch(() => [])
    promptsUsed = records.length

    if (promptsUsed >= FREE_PROMPT_LIMIT) {
      return NextResponse.json(
        { error: 'Prompt limit reached. Upgrade to Pro for unlimited prompts.', limitReached: true },
        { status: 403 }
      )
    }
  }

  const { messages } = await request.json() as { messages: ClaudeMsg[] }
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'Missing messages' }, { status: 400 })
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages,
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''
  const html = raw
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  const lastUserMsg = messages.filter(m => m.role === 'user').at(-1)?.content ?? ''
  await base()(Tables.AI_PROJECTS).create({
    owner_id: userId,
    prompt: lastUserMsg.slice(0, 500),
    generated_content: html.slice(0, 100000),
    created_at: new Date().toISOString(),
  } as Record<string, unknown>).catch(() => {})

  return NextResponse.json({
    html,
    promptsUsed: isPro ? null : promptsUsed + 1,
    promptsRemaining: isPro ? null : FREE_PROMPT_LIMIT - (promptsUsed + 1),
  })
}

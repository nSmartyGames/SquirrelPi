import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { businessInfo } = await request.json()
  if (!businessInfo) return NextResponse.json({ error: 'Missing businessInfo' }, { status: 400 })

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `You are a social media copywriter. Write a 7-day Instagram content calendar (Monday through Sunday) for this business: "${businessInfo}"

Each day needs a punchy headline (max ~6 words, ALL CAPS reads well since it's rendered large), a one-to-two-line subtitle, and a short CTA button label (max ~6 words). Vary the angle across the week: a proof point/stat, a pricing/objection-handling day, a case study/testimonial, a call-to-action/engagement day, a mission/values day, and a weekly recap.

Return ONLY a JSON array of exactly 7 objects, one per day in Mon-Sun order:
[
  { "headline": "...", "sub": "...", "cta": "..." }
]

Use "\\n" inside a string for an intentional line break. No markdown, no commentary, just the JSON array.`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    const themes = jsonMatch ? JSON.parse(jsonMatch[0]) : null
    if (!Array.isArray(themes) || themes.length !== 7) {
      return NextResponse.json({ error: 'Model did not return 7 days', raw: text }, { status: 502 })
    }
    return NextResponse.json({ themes: themes.map((t, i) => ({ day: DAYS[i], ...t })) })
  } catch {
    return NextResponse.json({ error: 'Could not parse model output', raw: text }, { status: 502 })
  }
}

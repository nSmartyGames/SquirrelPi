import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { prompt } = await request.json()
  if (!prompt) return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `You are an expert web designer and developer. Generate a complete website design brief based on this request: "${prompt}"

Return a JSON object with:
{
  "title": "Website title",
  "tagline": "Short tagline",
  "sections": [
    {
      "type": "hero|about|features|cta|footer",
      "headline": "Section headline",
      "subheadline": "Supporting text",
      "copy": "Body copy",
      "ctaText": "Button label (optional)"
    }
  ],
  "colors": {
    "primary": "#hexcode",
    "secondary": "#hexcode",
    "background": "#hexcode",
    "text": "#hexcode"
  },
  "style": "minimal|bold|elegant|playful"
}`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const generated = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: text }
    return NextResponse.json({ generated })
  } catch {
    return NextResponse.json({ generated: { raw: text } })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { Resend } from 'resend'

const ADMIN_EMAIL = 'lucian.virtic@hotmail.com'

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { previewUrl, siteTitle } = await request.json()
  if (!previewUrl) return NextResponse.json({ error: 'Missing previewUrl' }, { status: 400 })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'Email service not configured' }, { status: 503 })

  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from: 'Squirrel Pi <noreply@allibuild.com>',
    to: ADMIN_EMAIL,
    subject: `Site ready for dev: ${siteTitle || 'Untitled'}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
        <h2 style="margin:0 0 16px;color:#111">Site handed to dev</h2>
        <p style="margin:0 0 24px;color:#555">A site is ready for development review.</p>
        <p style="margin:0 0 8px;color:#555"><strong>Title:</strong> ${siteTitle || 'Untitled'}</p>
        <p style="margin:0 0 24px;color:#555"><strong>Preview:</strong> <a href="${previewUrl}" style="color:#4ade80">${previewUrl}</a></p>
        <a href="${previewUrl}" style="display:inline-block;background:#4ade80;color:#000;font-weight:700;padding:12px 24px;border-radius:9999px;text-decoration:none;">Open Preview →</a>
      </div>
    `,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

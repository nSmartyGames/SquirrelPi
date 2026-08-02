'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import styles from './CardPreview.module.css'
import { LOCALBIZ_PRO } from '@/lib/campaigns/business'

const BLUE = '#4a90d9'
const CREAM = '#f0eacc'
const DIM = '#6478a0'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface Theme {
  headline: string
  sub: string
  cta: string
}

const DEFAULT_THEMES: Theme[] = [
  {
    headline: 'MEET LOCALBIZ PRO',
    sub: 'Smart AI Solutions For Your Business',
    cta: 'Free Audit → Link in Bio',
  },
  {
    headline: '87% OF CUSTOMERS\nRESEARCH ONLINE FIRST',
    sub: 'Is your business ready to be found?',
    cta: 'Book Free Audit Today',
  },
  {
    headline: '"HOW MUCH DOES IT COST?"',
    sub: 'Starter from $500 · Pro from $1,500\nROI: clients report 10x returns',
    cta: 'DM PRICING for our guide',
  },
  {
    headline: 'FROM 0 TO 5 CLIENTS/MONTH',
    sub: 'One professional website changed everything.\nThis could be your story.',
    cta: 'DM CASE STUDY for details',
  },
  {
    headline: 'TAG 3 ENTREPRENEURS\nWHO NEED THIS',
    sub: 'Their first audit is FREE if they reach out today.',
    cta: 'Tag them below',
  },
  {
    headline: 'BUILDING YOUR BUSINESS\nONLINE IS OUR MISSION',
    sub: 'AI Automation · Productivity · Custom Solutions',
    cta: 'See what we built → Link in Bio',
  },
  {
    headline: 'THIS WEEK IN REVIEW',
    sub: 'New clients. New websites. New growth.\nJoin the LocalBiz Pro community.',
    cta: 'Start your journey → Free Audit',
  },
]

const ICONS = [
  {
    label: 'AI\nAuto',
    svg: (
      <svg viewBox="0 0 24 24" width="26" height="26" stroke={BLUE} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
      </svg>
    ),
  },
  {
    label: 'Pro-\nductiv.',
    svg: (
      <svg viewBox="0 0 24 24" width="26" height="26" stroke={BLUE} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="5" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="3" y="11" width="7" height="10" rx="1" /><rect x="14" y="11" width="7" height="10" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Inte-\ngration',
    svg: (
      <svg viewBox="0 0 24 24" width="26" height="26" stroke={BLUE} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    label: 'Custom\nSol.',
    svg: (
      <svg viewBox="0 0 24 24" width="26" height="26" stroke={BLUE} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
  },
]

interface CardFields {
  headline: string
  sub: string
  cta: string
  website: string
  badge: string
}

function CardPreview({ fields }: { fields: CardFields }) {
  const headline = fields.headline.split('\n')
  const sub = fields.sub.split('\n')

  return (
    <div className={styles.cardScene} style={{ fontFamily: "'Arial Black', Arial, sans-serif" }}>
      <div className={styles.cardGrid} />
      <div className={styles.cardOrb1} />
      <div className={styles.cardOrb2} />

      <div className={styles.cardCorner} style={{ top: 24, left: 24, borderWidth: '2px 0 0 2px', borderRadius: '4px 0 0 0' }} />
      <div className={styles.cardCorner} style={{ top: 24, right: 24, borderWidth: '2px 2px 0 0', borderRadius: '0 4px 0 0' }} />
      <div className={styles.cardCorner} style={{ bottom: 24, left: 24, borderWidth: '0 0 2px 2px', borderRadius: '0 0 0 4px' }} />
      <div className={styles.cardCorner} style={{ bottom: 24, right: 24, borderWidth: '0 2px 2px 0', borderRadius: '0 0 4px 0' }} />

      <div className={styles.cardMain}>
        <div className={styles.cardBox}>
          <div style={{ display: 'flex', gap: 60, alignItems: 'center' }}>
            {/* LEFT */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ lineHeight: 0.9 }}>
                <div style={{ fontSize: 96, fontWeight: 900, letterSpacing: 8, color: CREAM, textShadow: '0 0 40px rgba(240,234,204,0.15)' }}>
                  {LOCALBIZ_PRO.brandLine1}
                </div>
                <div style={{ fontSize: 96, fontWeight: 900, letterSpacing: 8, color: BLUE, textShadow: '0 0 30px rgba(74,144,217,0.4)' }}>
                  {LOCALBIZ_PRO.brandLine2}
                </div>
              </div>

              <div style={{ marginTop: 20, fontSize: 14, fontWeight: 700, letterSpacing: 4, color: BLUE, textTransform: 'uppercase' }}>
                {LOCALBIZ_PRO.tagline}
              </div>

              <div style={{ marginTop: 18, width: 60, height: 3, background: `linear-gradient(90deg, ${BLUE}, transparent)`, borderRadius: 2 }} />

              <div style={{ marginTop: 18 }}>
                {headline.map((l, i) => (
                  <div key={i} style={{ fontSize: 36, fontWeight: 900, letterSpacing: 2, color: CREAM, lineHeight: 1.2, textTransform: 'uppercase' }}>{l}</div>
                ))}
              </div>

              <div style={{ marginTop: 12 }}>
                {sub.map((l, i) => (
                  <div key={i} style={{ fontSize: 20, color: DIM, lineHeight: 1.5 }}>{l}</div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 20, marginTop: 28 }}>
                {ICONS.map((ic, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div className={styles.iconBoxCard}>{ic.svg}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: 'rgba(240,234,204,0.7)', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.3, whiteSpace: 'pre-line' }}>
                      {ic.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — photo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ position: 'relative', width: 220, height: 220, borderRadius: '50%', border: `3px solid ${BLUE}`, boxShadow: '0 0 0 6px rgba(74,144,217,0.1), 0 0 40px rgba(74,144,217,0.25)', overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={LOCALBIZ_PRO.founderPhoto}
                  alt={LOCALBIZ_PRO.founderPhotoAlt}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
                />
              </div>
              <div style={{ background: `linear-gradient(135deg, ${BLUE}, #7fc6ff)`, color: '#0a0a14', fontSize: 11, fontWeight: 900, letterSpacing: 2, padding: '8px 20px', borderRadius: 20, textTransform: 'uppercase' }}>
                {fields.badge}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ marginTop: 36, paddingTop: 24, borderTop: '1px solid rgba(74,144,217,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 3, color: 'rgba(240,234,204,0.5)', textTransform: 'lowercase' }}>
              {fields.website}
            </div>
            <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: 3, color: BLUE, textTransform: 'uppercase', border: '1.5px solid rgba(74,144,217,0.5)', padding: '10px 24px', borderRadius: 30, background: 'rgba(74,144,217,0.08)' }}>
              {fields.cta}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CampaignsContent() {
  const [dayIdx, setDayIdx] = useState(0)
  const [themes, setThemes] = useState<Theme[]>(DEFAULT_THEMES)
  const [fields, setFields] = useState<CardFields>({
    headline: DEFAULT_THEMES[0].headline,
    sub: DEFAULT_THEMES[0].sub,
    cta: DEFAULT_THEMES[0].cta,
    website: LOCALBIZ_PRO.website,
    badge: LOCALBIZ_PRO.badge,
  })
  const [downloading, setDownloading] = useState(false)
  const [allProgress, setAllProgress] = useState<string | null>(null)
  const [scale, setScale] = useState(0.4)
  const [businessInfo, setBusinessInfo] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [posting, setPosting] = useState(false)
  const [postResult, setPostResult] = useState<{ ok: boolean; message: string } | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const scaleRef = useRef<HTMLDivElement>(null)
  const previewAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = previewAreaRef.current
    if (!el) return
    const compute = () => {
      const availW = el.clientWidth - 48
      const availH = el.clientHeight - 48
      setScale(Math.min(availW / 1080, availH / 1080, 1))
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const selectDay = (i: number) => {
    setDayIdx(i)
    setFields(f => ({ ...f, headline: themes[i].headline, sub: themes[i].sub, cta: themes[i].cta }))
  }

  const generateWithAI = useCallback(async () => {
    if (generating || !businessInfo.trim()) return
    setGenerating(true)
    setGenerateError(null)
    try {
      const res = await fetch('/api/ai/campaign-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessInfo }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      const newThemes: Theme[] = data.themes.map((t: Theme) => ({ headline: t.headline, sub: t.sub, cta: t.cta }))
      setThemes(newThemes)
      setDayIdx(0)
      setFields(f => ({ ...f, headline: newThemes[0].headline, sub: newThemes[0].sub, cta: newThemes[0].cta }))
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }, [businessInfo, generating])

  const downloadPNG = useCallback(async () => {
    if (!previewRef.current || !scaleRef.current || downloading) return
    setDownloading(true)
    const el = scaleRef.current
    const prevTransform = el.style.transform
    try {
      el.style.transform = 'none'
      const html2canvas = (await import('html2canvas-pro')).default
      const canvas = await html2canvas(previewRef.current, {
        width: 1080,
        height: 1080,
        scale: 1,
        useCORS: true,
        backgroundColor: '#0a0a14',
      })
      const blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
      if (!blob) throw new Error('Failed to generate PNG')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `localbizpro-${DAYS[dayIdx].toLowerCase()}-card.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      el.style.transform = prevTransform
      setDownloading(false)
    }
  }, [dayIdx, downloading])

  const postToInstagram = useCallback(async () => {
    if (!previewRef.current || !scaleRef.current || posting) return
    setPosting(true)
    setPostResult(null)
    const el = scaleRef.current
    const prevTransform = el.style.transform
    try {
      el.style.transform = 'none'
      const html2canvas = (await import('html2canvas-pro')).default
      const canvas = await html2canvas(previewRef.current, {
        width: 1080,
        height: 1080,
        scale: 1,
        useCORS: true,
        backgroundColor: '#0a0a14',
      })
      const imageDataUrl = canvas.toDataURL('image/png')
      const caption = [fields.headline.replace(/\n/g, ' '), fields.sub.replace(/\n/g, ' '), fields.cta].join('\n\n')

      const res = await fetch('/api/meta/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDataUrl, caption }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to post')
      setPostResult({ ok: true, message: `Posted to Instagram (id: ${data.postId})` })
    } catch (err) {
      setPostResult({ ok: false, message: err instanceof Error ? err.message : 'Failed to post' })
    } finally {
      el.style.transform = prevTransform
      setPosting(false)
    }
  }, [fields, posting])

  const downloadAllDays = useCallback(async () => {
    if (downloading || allProgress || !scaleRef.current) return
    const html2canvas = (await import('html2canvas-pro')).default
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    const savedFields = { ...fields }
    const savedDay = dayIdx
    const el = scaleRef.current
    const prevTransform = el.style.transform
    el.style.transform = 'none'

    try {
      for (let i = 0; i < 7; i++) {
        setAllProgress(`${i + 1} / 7 — ${DAYS[i]}`)
        setDayIdx(i)
        setFields(f => ({ ...f, headline: themes[i].headline, sub: themes[i].sub, cta: themes[i].cta }))
        // Wait for React to re-render
        await new Promise(r => setTimeout(r, 300))
        if (!previewRef.current) continue
        const canvas = await html2canvas(previewRef.current, {
          width: 1080, height: 1080, scale: 1, useCORS: true, backgroundColor: '#0a0a14',
        })
        const blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
        if (!blob) continue
        zip.file(`localbizpro-${DAYS[i].toLowerCase()}-card.png`, blob)
      }

      setAllProgress('Zipping')
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'localbizpro-weekly-cards.zip'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      el.style.transform = prevTransform
      setDayIdx(savedDay)
      setFields(savedFields)
      setAllProgress(null)
    }
  }, [downloading, allProgress, fields, dayIdx, themes])

  const update = (key: keyof CardFields) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
    setFields(f => ({ ...f, [key]: e.target.value }))

  return (
    <div className="flex gap-6 px-8 py-6" style={{ minHeight: 'calc(100vh - 140px)' }}>
      {/* CONTROL PANEL */}
      <div className={styles.panel}>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Generate week with AI</label>
          <textarea
            className={styles.controlInput}
            rows={3}
            placeholder="Describe the business (industry, tone, offer)…"
            value={businessInfo}
            onChange={e => setBusinessInfo(e.target.value)}
          />
          <button
            className={cn(styles.dlBtn, styles.dlBtnOutline)}
            style={{ marginTop: 8 }}
            onClick={generateWithAI}
            disabled={generating || !businessInfo.trim()}
          >
            {generating ? 'Generating…' : 'Generate 7 Days'}
          </button>
          {generateError && (
            <p style={{ marginTop: 8, fontSize: 11, color: '#e07070' }}>{generateError}</p>
          )}
        </div>

        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Weekly Theme</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {DAYS.map((d, i) => (
              <button
                key={i}
                className={cn(styles.dayBtn, dayIdx === i && styles.dayBtnActive)}
                onClick={() => selectDay(i)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Headline (use \n for line break)</label>
          <textarea className={styles.controlInput} rows={3} value={fields.headline} onChange={update('headline')} />
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Subtitle</label>
          <textarea className={styles.controlInput} rows={3} value={fields.sub} onChange={update('sub')} />
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>CTA Button Text</label>
          <input className={styles.controlInput} value={fields.cta} onChange={update('cta')} />
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Website</label>
          <input className={styles.controlInput} value={fields.website} onChange={update('website')} />
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Badge Text</label>
          <input className={styles.controlInput} value={fields.badge} onChange={update('badge')} />
        </div>

        <div style={{ padding: '20px 20px 8px' }}>
          <button className={styles.dlBtn} onClick={downloadPNG} disabled={downloading || !!allProgress}>
            {downloading ? 'Exporting...' : 'Download PNG (1080×1080)'}
          </button>
        </div>

        <div style={{ padding: '0 20px 20px' }}>
          <button
            className={cn(styles.dlBtn, styles.dlBtnOutline)}
            onClick={downloadAllDays}
            disabled={downloading || !!allProgress}
          >
            {allProgress ? `Exporting ${allProgress}...` : 'Download All 7 Days'}
          </button>
        </div>

        <div style={{ padding: '0 20px 20px' }}>
          <button
            className={styles.dlBtn}
            style={{ background: '#c13584' }}
            onClick={postToInstagram}
            disabled={posting || downloading || !!allProgress}
          >
            {posting ? 'Posting...' : 'Post to Instagram'}
          </button>
          {postResult && (
            <p style={{ marginTop: 8, fontSize: 11, color: postResult.ok ? '#4ade80' : '#e07070' }}>
              {postResult.message}
            </p>
          )}
        </div>

        <div style={{ padding: '0 20px 20px', fontSize: 11, color: DIM, lineHeight: 1.6 }}>
          Preview is scaled to fit screen. Export is full 1080×1080.
        </div>
      </div>

      {/* PREVIEW AREA */}
      <div ref={previewAreaRef} className="flex-1 flex items-center justify-center overflow-hidden rounded-xl border border-border bg-[#0a0a14]">
        <div
          ref={scaleRef}
          style={{
            transformOrigin: 'center center',
            transform: `scale(${scale})`,
            width: 1080,
            height: 1080,
          }}
        >
          <div ref={previewRef}>
            <CardPreview fields={fields} />
          </div>
        </div>
      </div>
    </div>
  )
}

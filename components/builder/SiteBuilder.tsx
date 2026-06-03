'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Palette, Plus, Mail, X, Send, Zap, ChevronDown, ChevronUp, Crown, LayoutGrid,
  ChevronLeft, ChevronRight, Type,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const FREE_PROMPT_LIMIT = 10

interface ColorPalette {
  id: string; label: string; bg: string; text: string; accent: string; border: string; swatch: string
}

interface DisplayMsg { id: string; role: 'user' | 'assistant'; content: string }
interface ClaudeMsg  { role: 'user' | 'assistant'; content: string }

interface SiteBuilderProps {
  initialHtml?: string
  isPro?: boolean
  promptsUsed?: number
}

type SectionElementType = 'card' | 'button' | 'form'

const palettes: ColorPalette[] = [
  { id: 'dark',   label: 'Dark',   bg: '#0a0a0f', text: '#f0f0f0', accent: '#4ade80', border: '#1a2a1a', swatch: '#4ade80' },
  { id: 'ocean',  label: 'Ocean',  bg: '#0c1a2e', text: '#e2f0f9', accent: '#38bdf8', border: '#1e3a5f', swatch: '#38bdf8' },
  { id: 'sunset', label: 'Sunset', bg: '#1a0800', text: '#fff0e6', accent: '#f97316', border: '#3d1800', swatch: '#f97316' },
  { id: 'purple', label: 'Purple', bg: '#0f0a1a', text: '#f3e8ff', accent: '#a855f7', border: '#2a1a4a', swatch: '#a855f7' },
  { id: 'rose',   label: 'Rose',   bg: '#1a0a10', text: '#ffe4e6', accent: '#fb7185', border: '#3d1020', swatch: '#fb7185' },
  { id: 'light',  label: 'Light',  bg: '#f8f9fa', text: '#1a1a2e', accent: '#2563eb', border: '#e2e8f0', swatch: '#2563eb' },
]

function buildPaletteOverride(p: ColorPalette): string {
  return `:root{--bg:${p.bg}!important;--bg2:${p.bg}!important;--bg3:${p.bg}!important;--text:${p.text}!important;--muted:${p.text}99!important;--accent:${p.accent}!important;--accent2:${p.accent}!important;--border:${p.border}!important;--radius:12px;}body,html{background:${p.bg}!important;color:${p.text}!important;}`
}

function parseHtml(html: string): { styles: string; body: string } {
  const styleBlocks: string[] = []
  const stripped = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_, content) => {
    styleBlocks.push(content)
    return ''
  }).replace(/<script[\s\S]*?<\/script>/gi, '')
  const bodyMatch = stripped.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  return {
    styles: styleBlocks.join('\n'),
    body: (bodyMatch?.[1] ?? stripped).trim(),
  }
}

function reconstructHtml(bodyInner: string, styles: string, palette: ColorPalette): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>${styles}</style><style>${buildPaletteOverride(palette)}</style></head><body>${bodyInner}</body></html>`
}

function buildColumnContent(type: SectionElementType): string {
  if (type === 'card') {
    return `<h3 style="color:var(--accent);font-size:1.1rem;font-weight:700;margin:0 0 0.5rem 0;">Card Title</h3><p style="color:var(--text);opacity:0.7;font-size:0.875rem;margin:0;line-height:1.6;">Add your description here.</p>`
  }
  if (type === 'button') {
    return `<a href="#" style="display:inline-block;background:var(--accent);color:var(--bg);font-weight:700;padding:0.75rem 1.75rem;border-radius:9999px;text-decoration:none;font-size:0.875rem;">Button Text</a>`
  }
  return `<form style="display:flex;flex-direction:column;gap:0.625rem;" onsubmit="return false"><h4 style="color:var(--accent);font-size:0.95rem;font-weight:700;margin:0 0 0.125rem 0;">Contact</h4><input type="text" placeholder="Name" style="background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:8px;padding:0.5rem 0.75rem;color:var(--text);font-size:0.8rem;outline:none;width:100%;box-sizing:border-box;"/><input type="email" placeholder="Email" style="background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:8px;padding:0.5rem 0.75rem;color:var(--text);font-size:0.8rem;outline:none;width:100%;box-sizing:border-box;"/><textarea rows="3" placeholder="Message…" style="background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:8px;padding:0.5rem 0.75rem;color:var(--text);font-size:0.8rem;outline:none;resize:none;width:100%;box-sizing:border-box;"></textarea><a href="#" onclick="return false" style="display:inline-block;background:var(--accent);color:var(--bg);font-weight:700;padding:0.5rem 1rem;border-radius:9999px;text-decoration:none;font-size:0.8rem;text-align:center;cursor:pointer;">Send</a></form>`
}

const ADD_BTN_HTML = `<button data-squirrel-add contenteditable="false" style="align-self:flex-end;width:32px;height:32px;border-radius:50%;background:var(--accent);border:none;cursor:pointer;font-size:20px;line-height:32px;text-align:center;color:var(--bg);font-weight:bold;opacity:0.45;flex-shrink:0;transition:opacity 0.15s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.45'">+</button>`

function buildSection(cols: number, type: SectionElementType): string {
  const columns = Array(cols).fill(null).map(() =>
    `<div data-squirrel-col style="flex:1;min-width:200px;padding:1.5rem;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:12px;display:flex;flex-direction:column;gap:0.75rem;">${buildColumnContent(type)}${ADD_BTN_HTML}</div>`
  ).join('\n    ')
  return `\n<section style="padding:3rem 5vw;"><div style="display:flex;gap:1.25rem;flex-wrap:wrap;">\n    ${columns}\n  </div></section>\n`
}

function buildContactSection(): string {
  return `\n<section style="padding:3rem 5vw;"><div data-squirrel-col style="max-width:520px;margin:0 auto;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:12px;padding:2rem;display:flex;flex-direction:column;gap:0.875rem;"><h3 style="color:var(--accent);font-size:1.25rem;font-weight:700;margin:0;">Contact Us</h3><form style="display:flex;flex-direction:column;gap:0.75rem;" onsubmit="return false"><div style="display:flex;gap:0.75rem;"><input type="text" placeholder="Name" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:8px;padding:0.625rem 0.875rem;color:var(--text);font-size:0.875rem;outline:none;"/><input type="email" placeholder="Email" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:8px;padding:0.625rem 0.875rem;color:var(--text);font-size:0.875rem;outline:none;"/></div><textarea rows="4" placeholder="Your message…" style="background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:8px;padding:0.625rem 0.875rem;color:var(--text);font-size:0.875rem;outline:none;resize:vertical;"></textarea><a href="#" onclick="return false" style="display:inline-block;background:var(--accent);color:var(--bg);font-weight:700;padding:0.75rem 1.75rem;border-radius:9999px;text-decoration:none;font-size:0.875rem;text-align:center;cursor:pointer;">Send Message</a></form>${ADD_BTN_HTML}</div></section>\n`
}

function stripBuilderUI(html: string): string {
  return html.replace(/<button[^>]*data-squirrel-add[^>]*>[\s\S]*?<\/button>/g, '')
}

// ── WebsiteEditor ─────────────────────────────────────────────────────────────
interface WebsiteEditorProps {
  html: string
  palette: ColorPalette
  onChange: (html: string) => void
  editorRef: React.RefObject<HTMLDivElement | null>
  onColumnAdd?: (columnEl: HTMLElement) => void
}

function WebsiteEditor({ html, palette, onChange, editorRef, onColumnAdd }: WebsiteEditorProps) {
  const { styles, body } = useMemo(() => parseHtml(html), [html])
  const lastExternalRef = useRef(html)
  const stylesRef = useRef(styles)
  stylesRef.current = styles

  useEffect(() => {
    if (html !== lastExternalRef.current && editorRef.current) {
      lastExternalRef.current = html
      editorRef.current.innerHTML = body
    }
  }, [html, body, editorRef])

  useEffect(() => {
    if (editorRef.current && body) {
      editorRef.current.innerHTML = body
      lastExternalRef.current = html
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const newBody = e.currentTarget.innerHTML
    const reconstructed = reconstructHtml(newBody, stylesRef.current, palette)
    lastExternalRef.current = reconstructed
    onChange(reconstructed)
  }, [onChange, palette])

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const addBtn = target.hasAttribute('data-squirrel-add')
      ? target
      : (target.closest('[data-squirrel-add]') as HTMLElement | null)
    if (addBtn) {
      e.preventDefault()
      e.stopPropagation()
      const col = addBtn.closest('[data-squirrel-col]') as HTMLElement | null
      if (col && onColumnAdd) onColumnAdd(col)
    }
  }, [onColumnAdd])

  const paletteOverride = buildPaletteOverride(palette)

  return (
    <div id="website-theme" style={{ background: palette.bg, minHeight: '100%' }}>
      <style dangerouslySetInnerHTML={{ __html: styles + '\n' + paletteOverride }} />
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onClick={handleClick}
        style={{ outline: 'none', minHeight: '100vh' }}
      />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
type ModalType = 'section' | 'column-add' | null

export default function SiteBuilder({ initialHtml, isPro = false, promptsUsed: initialPromptsUsed = 0 }: SiteBuilderProps) {
  const [palette, setPalette] = useState<ColorPalette>(palettes[0])
  const [siteTitle, setSiteTitle] = useState('My Website')
  const [modal, setModal] = useState<ModalType>(null)
  const [sectionCols, setSectionCols] = useState(2)
  const [sectionType, setSectionType] = useState<SectionElementType>('card')

  // AI console
  const [generatedHtml, setGeneratedHtml] = useState(initialHtml ?? '')
  const [consoleOpen, setConsoleOpen] = useState(true)
  const [displayMsgs, setDisplayMsgs] = useState<DisplayMsg[]>([])
  const [claudeHistory, setClaudeHistory] = useState<ClaudeMsg[]>([])
  const [consoleInput, setConsoleInput] = useState('')
  const [generating, setGenerating] = useState(false)

  // Prompt tracking
  const [localPromptsUsed, setLocalPromptsUsed] = useState(initialPromptsUsed)
  const [limitReached, setLimitReached] = useState(!isPro && initialPromptsUsed >= FREE_PROMPT_LIMIT)

  // Deploy
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [deployUrl, setDeployUrl] = useState('')
  const [handingOver, setHandingOver] = useState(false)
  const [handoverUrl, setHandoverUrl] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const targetColumnRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (consoleOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayMsgs, consoleOpen])

  useEffect(() => {
    if (initialHtml) setClaudeHistory([{ role: 'assistant', content: initialHtml }])
  }, [initialHtml])

  function insertSection() {
    if (!editorRef.current) return
    const html = sectionType === 'form' ? buildContactSection() : buildSection(sectionCols, sectionType)
    editorRef.current.insertAdjacentHTML('beforeend', html)
    const newBody = editorRef.current.innerHTML
    const { styles } = parseHtml(generatedHtml)
    setGeneratedHtml(reconstructHtml(newBody, styles, palette))
    setModal(null)
  }

  function insertIntoColumn() {
    const col = targetColumnRef.current
    if (!col || !editorRef.current) return
    const addBtn = col.querySelector('[data-squirrel-add]') as HTMLElement | null
    const content = buildColumnContent(sectionType)
    if (addBtn) {
      addBtn.insertAdjacentHTML('beforebegin', `<div style="margin-top:0.25rem;">${content}</div>`)
    } else {
      col.insertAdjacentHTML('beforeend', content)
    }
    const newBody = editorRef.current.innerHTML
    const { styles } = parseHtml(generatedHtml)
    setGeneratedHtml(reconstructHtml(newBody, styles, palette))
    setModal(null)
    targetColumnRef.current = null
  }

  const handleColumnAdd = useCallback((columnEl: HTMLElement) => {
    targetColumnRef.current = columnEl
    setModal('column-add')
  }, [])

  async function sendConsoleMsg() {
    const input = consoleInput.trim()
    if (!input || generating) return
    if (input === '/clean') {
      setDisplayMsgs([])
      setClaudeHistory([])
      setGeneratedHtml('')
      if (editorRef.current) editorRef.current.innerHTML = ''
      setDeployUrl('')
      setConsoleInput('')
      return
    }
    if (limitReached) return

    setConsoleInput('')
    setDisplayMsgs(prev => [...prev, { id: crypto.randomUUID(), role: 'user', content: input }])
    const newHistory: ClaudeMsg[] = [...claudeHistory, { role: 'user', content: input }]
    setGenerating(true)

    try {
      const res = await fetch('/api/ai/html-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory }),
      })
      const data = await res.json()

      if (data.limitReached) {
        setLimitReached(true)
        setDisplayMsgs(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: 'Prompt limit reached. Upgrade to Pro for unlimited prompts.' }])
        return
      }

      if (data.html) {
        setGeneratedHtml(data.html)
        setClaudeHistory([...newHistory, { role: 'assistant', content: data.html }])
        if (!isPro && data.promptsUsed != null) {
          setLocalPromptsUsed(data.promptsUsed)
          if (data.promptsRemaining <= 0) setLimitReached(true)
        }
        setDisplayMsgs(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: 'Page generated — you can now edit any text directly on the canvas. Type /clean to start fresh.' }])
      } else {
        setDisplayMsgs(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: data.error || 'Generation failed.' }])
      }
    } catch {
      setDisplayMsgs(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: 'Request failed. Check connection.' }])
    } finally {
      setGenerating(false)
    }
  }

  async function deployLive() {
    if (!generatedHtml) return
    setDeploying(true)
    setDeployUrl('')
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName: siteTitle, siteName: siteTitle, htmlContent: stripBuilderUI(generatedHtml) }),
      })
      const data = await res.json()
      if (data.pagesUrl) setDeployUrl(data.pagesUrl)
    } catch { /* silent */ } finally { setDeploying(false) }
  }

  async function handleToDev() {
    if (!generatedHtml) return
    setHandingOver(true)
    setHandoverUrl('')
    setEmailSent(false)
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName: siteTitle, siteName: siteTitle, htmlContent: stripBuilderUI(generatedHtml) }),
      })
      const data = await res.json()
      if (data.pagesUrl) setHandoverUrl(data.pagesUrl)
    } catch { /* silent */ } finally { setHandingOver(false) }
  }

  async function sendHandoverEmail() {
    setSendingEmail(true)
    try {
      await fetch('/api/email/handover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ previewUrl: handoverUrl, siteTitle }),
      })
      setEmailSent(true)
    } finally { setSendingEmail(false) }
  }

  const promptsRemaining = FREE_PROMPT_LIMIT - localPromptsUsed
  const promptWarning = !isPro && promptsRemaining <= 3 && !limitReached

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── Center: canvas ── */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">

          {/* ── Floating tool sidebar ── */}
          {sidebarOpen ? (
            <aside className="absolute left-0 top-0 h-full w-56 z-20 border-r border-border bg-card/95 backdrop-blur-sm flex flex-col gap-4 p-4 overflow-y-auto shadow-xl">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Theme</p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Palette className="w-4 h-4 text-primary shrink-0" />
                  Color Palette
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {palettes.map(p => (
                    <button
                      key={p.id}
                      title={p.label}
                      onClick={() => setPalette(p)}
                      className={`h-9 rounded-lg border-2 transition-all ${palette.id === p.id ? 'border-white scale-105' : 'border-transparent hover:border-white/30'}`}
                      style={{ background: `linear-gradient(135deg, ${p.bg} 40%, ${p.swatch})` }}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground">{palette.label}</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Type className="w-4 h-4 text-primary shrink-0" />
                  Site name
                </div>
                <input
                  type="text"
                  value={siteTitle}
                  onChange={e => setSiteTitle(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg bg-background/50 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>

              <div className="mt-auto space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Tips</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">Click any text to edit inline. Use AI console to generate sections.</p>
              </div>
            </aside>
          ) : (
            <aside className="absolute left-0 top-0 h-full w-10 z-20 border-r border-border bg-card/95 backdrop-blur-sm flex flex-col items-center py-4 gap-3 shadow-xl">
              <div title="Color Palette" className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Palette className="w-3.5 h-3.5 text-primary" />
              </div>
              <div title="Site name" className="w-7 h-7 rounded-lg bg-muted/20 flex items-center justify-center">
                <Type className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </aside>
          )}

          {/* ── Tool sidebar collapse toggle — centered on separator ── */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            title={sidebarOpen ? 'Collapse tools' : 'Expand tools'}
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground z-30 transition-colors"
            style={{ left: sidebarOpen ? '212px' : '28px', transition: 'left 200ms ease, color 150ms' }}
          >
            {sidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>

          {/* ── Toolbar (actions bar — not collapsible) ── */}
          <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-card/60 shrink-0 flex-wrap">
            <button
              onClick={() => setModal('section')}
              disabled={!generatedHtml}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/20 hover:border-primary/30 hover:bg-primary/5 text-xs font-semibold text-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-primary" />
              Add Section
            </button>

            <div className="ml-auto flex items-center gap-2 flex-wrap">
              <button
                onClick={handleToDev}
                disabled={handingOver || !generatedHtml}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Mail className="w-3.5 h-3.5" />
                {handingOver ? 'Creating…' : 'Handle to dev'}
              </button>
              <button
                onClick={deployLive}
                disabled={deploying || !generatedHtml}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap className="w-3.5 h-3.5" />
                {deploying ? 'Deploying…' : 'Deploy Live'}
              </button>
            </div>
          </div>

          {/* URL bars */}
          {(handoverUrl || deployUrl) && (
            <div className="flex items-center gap-4 px-4 py-1.5 border-b border-border bg-card/40 flex-wrap shrink-0">
              {handoverUrl && (
                <div className="flex items-center gap-2">
                  <a href={handoverUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary/80 hover:underline truncate max-w-48">{handoverUrl}</a>
                  <button
                    onClick={sendHandoverEmail}
                    disabled={sendingEmail || emailSent}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-primary/40 bg-primary/10 text-primary text-[10px] font-semibold hover:bg-primary/20 transition-colors disabled:opacity-60"
                  >
                    <Send className="w-2.5 h-2.5" />
                    {emailSent ? 'Sent ✓' : sendingEmail ? '…' : 'Email Admin'}
                  </button>
                </div>
              )}
              {deployUrl && (
                <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-emerald-400 hover:underline truncate max-w-48">{deployUrl}</a>
              )}
            </div>
          )}

          {/* Canvas */}
          <div className="flex-1 overflow-y-auto">
            {generatedHtml ? (
              <WebsiteEditor
                html={generatedHtml}
                palette={palette}
                onChange={setGeneratedHtml}
                editorRef={editorRef}
                onColumnAdd={handleColumnAdd}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-center p-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Palette className="w-7 h-7 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">Canvas is empty</p>
                <p className="text-xs text-muted-foreground max-w-xs">Use the AI console below to generate your page, or load a template from the Marketplace.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── AI Console ── */}
      <div
        className="shrink-0 border-t border-border bg-card/90 backdrop-blur-sm flex flex-col transition-all duration-200"
        style={{ height: consoleOpen ? 260 : 40 }}
      >
        <div className="flex items-center justify-between px-4 h-10 shrink-0 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Claude Console</span>
            <span className="text-[10px] text-muted-foreground/40">· /clean to reset</span>
          </div>
          <div className="flex items-center gap-3">
            {isPro ? (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                <Crown className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] font-semibold text-amber-400">Pro · Unlimited</span>
              </div>
            ) : (
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${limitReached ? 'bg-red-500/10 border-red-500/20 text-red-400' : promptWarning ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-muted/30 border-border text-muted-foreground'}`}>
                <span>{localPromptsUsed} / {FREE_PROMPT_LIMIT} prompts</span>
              </div>
            )}
            <button onClick={() => setConsoleOpen(o => !o)} className="text-muted-foreground hover:text-foreground transition-colors">
              {consoleOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {consoleOpen && (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 min-h-0">
              {displayMsgs.length === 0 && !limitReached && (
                <p className="text-[11px] text-muted-foreground/40 text-center pt-2">
                  {initialHtml ? 'Theme loaded — describe changes or ask Claude to modify it.' : 'Describe your page. e.g. "A SaaS landing page with dark theme, hero section, features grid and pricing"'}
                </p>
              )}
              {displayMsgs.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-1.5 rounded-xl text-[12px] leading-snug ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-muted/40 text-muted-foreground'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {generating && (
                <div className="flex justify-start">
                  <div className="px-3 py-1.5 rounded-xl bg-muted/40 text-muted-foreground text-[12px]">
                    <span className="inline-flex gap-0.5">
                      <span className="animate-bounce" style={{ animationDelay: '0ms' }}>·</span>
                      <span className="animate-bounce" style={{ animationDelay: '150ms' }}>·</span>
                      <span className="animate-bounce" style={{ animationDelay: '300ms' }}>·</span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 pb-3 pt-1 shrink-0">
              {limitReached ? (
                <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2">
                    <Crown className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-[12px] text-red-400 font-medium">Free limit reached ({FREE_PROMPT_LIMIT} prompts)</span>
                  </div>
                  <a href="/account" className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
                    <Crown className="w-3 h-3" />Upgrade to Pro
                  </a>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={consoleInput}
                    onChange={e => setConsoleInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendConsoleMsg()}
                    placeholder="Describe your page or a change… (/clean to reset)"
                    disabled={generating}
                    className="flex-1 px-3 py-2 rounded-lg bg-background/60 border border-border text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
                  />
                  <Button size="sm" onClick={sendConsoleMsg} disabled={generating || !consoleInput.trim()} className="px-3">
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {(modal === 'section' || modal === 'column-add') && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 w-80 space-y-5 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  {modal === 'column-add' ? 'Add to column' : 'Add Section'}
                </h3>
                <button onClick={() => setModal(null)}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
              </div>

              {modal === 'section' && sectionType !== 'form' && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">Columns</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map(n => (
                      <button
                        key={n}
                        onClick={() => setSectionCols(n)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${sectionCols === n ? 'bg-primary/20 border-primary/40 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Element type</p>
                <div className="flex gap-2">
                  {(['card', 'button', 'form'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setSectionType(t)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border capitalize transition-all ${sectionType === t ? 'bg-primary/20 border-primary/40 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'}`}
                    >
                      {t === 'form' ? 'Form' : t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                <Button size="sm" onClick={modal === 'column-add' ? insertIntoColumn : insertSection}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {modal === 'column-add' ? 'Add' : 'Insert'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

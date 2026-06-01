'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Palette, Type, Maximize2, Plus, Pencil, ExternalLink, Mail, X,
  Send, Zap, ChevronDown, ChevronUp, Smartphone, Monitor, Crown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const FREE_PROMPT_LIMIT = 10

interface PageItem {
  id: string
  title: string
  caption: string
}

interface ButtonItem {
  id: string
  label: string
  url: string
}

interface ColorPalette {
  id: string
  label: string
  bg: string
  text: string
  accent: string
  border: string
  swatch: string
}

interface SiteState {
  title: string
  palette: ColorPalette
  bigIcons: boolean
  largeFont: boolean
  pages: PageItem[]
  buttons: ButtonItem[]
  siteUrl: string
}

interface DisplayMsg {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ClaudeMsg {
  role: 'user' | 'assistant'
  content: string
}

interface SiteBuilderProps {
  initialHtml?: string
  isPro?: boolean
  membershipTier?: 'free' | 'pro' | 'pro_max'
  promptsUsed?: number
}

const palettes: ColorPalette[] = [
  { id: 'dark',   label: 'Dark',   bg: '#0a0a0f', text: '#f0f0f0', accent: '#4ade80', border: '#1a2a1a', swatch: '#4ade80' },
  { id: 'ocean',  label: 'Ocean',  bg: '#0c1a2e', text: '#e2f0f9', accent: '#38bdf8', border: '#1e3a5f', swatch: '#38bdf8' },
  { id: 'sunset', label: 'Sunset', bg: '#1a0800', text: '#fff0e6', accent: '#f97316', border: '#3d1800', swatch: '#f97316' },
  { id: 'purple', label: 'Purple', bg: '#0f0a1a', text: '#f3e8ff', accent: '#a855f7', border: '#2a1a4a', swatch: '#a855f7' },
  { id: 'rose',   label: 'Rose',   bg: '#1a0a10', text: '#ffe4e6', accent: '#fb7185', border: '#3d1020', swatch: '#fb7185' },
  { id: 'light',  label: 'Light',  bg: '#f8f9fa', text: '#1a1a2e', accent: '#2563eb', border: '#e2e8f0', swatch: '#2563eb' },
]

type ModalType = 'title' | 'menu' | 'button' | null

export default function SiteBuilder({ initialHtml, isPro = false, membershipTier = 'free', promptsUsed: initialPromptsUsed = 0 }: SiteBuilderProps) {
  const [site, setSite] = useState<SiteState>({
    title: 'My Website',
    palette: palettes[0],
    bigIcons: false,
    largeFont: false,
    pages: [],
    buttons: [],
    siteUrl: '',
  })
  const [modal, setModal] = useState<ModalType>(null)
  const [formTitle, setFormTitle] = useState('')
  const [formCaption, setFormCaption] = useState('')
  const [formBtnLabel, setFormBtnLabel] = useState('')
  const [formBtnUrl, setFormBtnUrl] = useState('')
  const [newTitle, setNewTitle] = useState(site.title)

  // AI console
  const [generatedHtml, setGeneratedHtml] = useState(initialHtml ?? '')
  const [consoleOpen, setConsoleOpen] = useState(true)
  const [displayMsgs, setDisplayMsgs] = useState<DisplayMsg[]>([])
  const [claudeHistory, setClaudeHistory] = useState<ClaudeMsg[]>([])
  const [consoleInput, setConsoleInput] = useState('')
  const [generating, setGenerating] = useState(false)
  const [previewMode, setPreviewMode] = useState<'phone' | 'web'>(initialHtml ? 'web' : 'phone')

  // Prompt tracking
  const [localPromptsUsed, setLocalPromptsUsed] = useState(initialPromptsUsed)
  const [limitReached, setLimitReached] = useState(!isPro && initialPromptsUsed >= FREE_PROMPT_LIMIT)

  // Deploy
  const [deploying, setDeploying] = useState(false)
  const [deployUrl, setDeployUrl] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (consoleOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [displayMsgs, consoleOpen])

  // Load initial template HTML into history so Claude knows the starting point
  useEffect(() => {
    if (initialHtml) {
      setClaudeHistory([{ role: 'assistant', content: initialHtml }])
    }
  }, [initialHtml])

  function openModal(type: ModalType) {
    setFormTitle('')
    setFormCaption('')
    setFormBtnLabel('')
    setFormBtnUrl('')
    setNewTitle(site.title)
    setModal(type)
  }

  function addPage() {
    if (!formTitle.trim()) return
    setSite(s => ({
      ...s,
      pages: [...s.pages, { id: crypto.randomUUID(), title: formTitle.trim(), caption: formCaption.trim() || formTitle.trim() }],
    }))
    setModal(null)
  }

  function addButton() {
    if (!formBtnLabel.trim() || !formBtnUrl.trim()) return
    setSite(s => ({
      ...s,
      buttons: [...s.buttons, { id: crypto.randomUUID(), label: formBtnLabel.trim(), url: formBtnUrl.trim() }],
    }))
    setModal(null)
  }

  function applyTitle() {
    setSite(s => ({ ...s, title: newTitle }))
    setModal(null)
  }

  async function sendConsoleMsg() {
    const input = consoleInput.trim()
    if (!input || generating) return

    if (input === '/clean') {
      setDisplayMsgs([])
      setClaudeHistory([])
      setGeneratedHtml('')
      setPreviewMode('phone')
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
        setDisplayMsgs(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Prompt limit reached. Upgrade to Pro for unlimited prompts.',
        }])
        return
      }

      if (data.html) {
        setGeneratedHtml(data.html)
        setPreviewMode('web')
        setClaudeHistory([...newHistory, { role: 'assistant', content: data.html }])
        if (!isPro && data.promptsUsed != null) {
          setLocalPromptsUsed(data.promptsUsed)
          if (data.promptsRemaining <= 0) setLimitReached(true)
        }
        setDisplayMsgs(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Page generated — preview updated. Type /clean to start fresh.',
        }])
      } else {
        setDisplayMsgs(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.error || 'Generation failed.',
        }])
      }
    } catch {
      setDisplayMsgs(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Request failed. Check connection.',
      }])
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
        body: JSON.stringify({
          projectName: site.title,
          siteName: site.title,
          htmlContent: generatedHtml,
        }),
      })
      const data = await res.json()
      if (data.pagesUrl) {
        setDeployUrl(data.pagesUrl)
        setSite(s => ({ ...s, siteUrl: data.pagesUrl }))
      }
    } catch {
      // silent
    } finally {
      setDeploying(false)
    }
  }

  const { bg, text, accent, border } = site.palette
  const titleSize = site.largeFont ? 22 : 17
  const menuSize  = site.largeFont ? 15 : 12
  const btnSize   = site.largeFont ? 14 : 11
  const iconPad   = site.bigIcons  ? 14 : 9

  function buildHandoverHref() {
    const url = site.siteUrl || (typeof window !== 'undefined' ? window.location.href : '')
    return `mailto:lucian.virtic@hotmail.com?subject=Handed%20to%20me&body=${encodeURIComponent(url)}`
  }

  const promptsRemaining = FREE_PROMPT_LIMIT - localPromptsUsed
  const promptWarning = !isPro && promptsRemaining <= 3 && !limitReached

  return (
    <div className="flex flex-col h-full">

      {/* ── Builder row ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── Left: design tools ── */}
        <aside className="w-56 shrink-0 border-r border-border bg-card flex flex-col gap-5 p-5 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Design Tools</p>

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
                  onClick={() => setSite(s => ({ ...s, palette: p }))}
                  className={`h-9 rounded-lg border-2 transition-all ${site.palette.id === p.id ? 'border-white scale-105' : 'border-transparent hover:border-white/30'}`}
                  style={{ background: `linear-gradient(135deg, ${p.bg} 40%, ${p.swatch})` }}
                />
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">{site.palette.label}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Maximize2 className="w-4 h-4 text-primary shrink-0" />
              Big Icons
            </div>
            <button
              onClick={() => setSite(s => ({ ...s, bigIcons: !s.bigIcons }))}
              className={`w-full py-2 rounded-lg text-sm font-medium border transition-all ${site.bigIcons ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-muted/30 border-border text-muted-foreground hover:border-primary/30'}`}
            >
              {site.bigIcons ? 'On' : 'Off'}
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Type className="w-4 h-4 text-primary shrink-0" />
              Large Font
            </div>
            <button
              onClick={() => setSite(s => ({ ...s, largeFont: !s.largeFont }))}
              className={`w-full py-2 rounded-lg text-sm font-medium border transition-all ${site.largeFont ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-muted/30 border-border text-muted-foreground hover:border-primary/30'}`}
            >
              {site.largeFont ? 'On' : 'Off'}
            </button>
          </div>

          <div className="mt-auto space-y-1.5">
            <p className="text-[10px] text-muted-foreground">Site URL (for handover email)</p>
            <input
              type="url"
              placeholder="https://my-site.pages.dev"
              value={site.siteUrl}
              onChange={e => setSite(s => ({ ...s, siteUrl: e.target.value }))}
              className="w-full px-2.5 py-2 rounded-lg bg-background/50 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
        </aside>

        {/* ── Center: preview ── */}
        <div className="flex-1 flex flex-col items-center gap-4 px-6 py-6 overflow-y-auto">
          {/* Preview header */}
          <div className="flex items-center gap-3 shrink-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Preview</p>
            {generatedHtml && (
              <div className="flex gap-1 rounded-lg border border-border p-0.5">
                <button
                  onClick={() => setPreviewMode('phone')}
                  title="Phone preview"
                  className={`p-1.5 rounded-md transition-colors ${previewMode === 'phone' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewMode('web')}
                  title="Web preview"
                  className={`p-1.5 rounded-md transition-colors ${previewMode === 'web' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Phone frame */}
          {(previewMode === 'phone' || !generatedHtml) && (
            <div className="relative shrink-0" style={{ width: 240, height: 480 }}>
              <div className="absolute inset-0 rounded-[36px] border-[5px] border-neutral-700 shadow-2xl overflow-hidden" style={{ background: bg }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-neutral-900 rounded-b-xl z-10" />
                <div className="absolute inset-0 overflow-y-auto" style={{ paddingTop: 28, background: bg, color: text }}>
                  <div className="px-4 pt-3 pb-2 border-b" style={{ borderColor: border }}>
                    <h1 style={{ fontSize: titleSize, fontWeight: 800, color: accent, lineHeight: 1.2 }}>
                      {site.title}
                    </h1>
                  </div>
                  {site.pages.map(p => (
                    <div key={p.id} className="border-b" style={{ borderColor: border, padding: `${iconPad}px 16px` }}>
                      <div style={{ fontSize: menuSize, fontWeight: 700, textTransform: 'uppercase', color: text, letterSpacing: '0.05em' }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize: menuSize - 1, fontVariant: 'small-caps', color: text, opacity: 0.55, marginTop: 2 }}>
                        {p.caption}
                      </div>
                    </div>
                  ))}
                  {site.buttons.length > 0 && (
                    <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {site.buttons.map(btn => (
                        <div
                          key={btn.id}
                          style={{ background: accent, color: bg, fontSize: btnSize, fontWeight: 700, padding: `${iconPad}px 16px`, borderRadius: 10, textAlign: 'center' }}
                        >
                          {btn.label}
                        </div>
                      ))}
                    </div>
                  )}
                  {site.pages.length === 0 && site.buttons.length === 0 && (
                    <div style={{ padding: 20, textAlign: 'center', opacity: 0.35, fontSize: 10 }}>
                      Use actions on the right to build your site
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute right-[-5px] top-20 w-1.5 h-12 bg-neutral-700 rounded-r-full" />
              <div className="absolute left-[-5px] top-16 w-1.5 h-8 bg-neutral-700 rounded-l-full" />
              <div className="absolute left-[-5px] top-28 w-1.5 h-8 bg-neutral-700 rounded-l-full" />
            </div>
          )}

          {/* Web iframe */}
          {previewMode === 'web' && generatedHtml && (
            <div className="w-full flex-1 min-h-0 rounded-xl overflow-hidden border border-border shadow-xl" style={{ minHeight: 400 }}>
              <iframe
                srcDoc={generatedHtml}
                className="w-full h-full"
                sandbox="allow-scripts allow-same-origin"
                title="Generated page preview"
                style={{ minHeight: 400 }}
              />
            </div>
          )}

          {/* Handle to dev + Deploy Live */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
            <a
              href={buildHandoverHref()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Handle to dev
            </a>
            <button
              onClick={deployLive}
              disabled={deploying || !generatedHtml}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4" />
              {deploying ? 'Deploying…' : 'Deploy Live'}
            </button>
          </div>

          {deployUrl && (
            <a
              href={deployUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-400 hover:underline shrink-0"
            >
              {deployUrl}
            </a>
          )}
        </div>

        {/* ── Right: actions ── */}
        <aside className="w-56 shrink-0 border-l border-border bg-card flex flex-col gap-4 p-5 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Actions</p>

          <button
            onClick={() => openModal('title')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-muted/20 hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Pencil className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Change Title</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Edit site heading</p>
            </div>
          </button>

          <button
            onClick={() => openModal('menu')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-muted/20 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <Plus className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Add Menu</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Create a page link</p>
            </div>
          </button>

          <button
            onClick={() => openModal('button')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-muted/20 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
              <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Add Button Action</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Link to a URL</p>
            </div>
          </button>

          {(site.pages.length > 0 || site.buttons.length > 0) && (
            <div className="mt-2 space-y-1.5">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Added</p>
              {site.pages.map(p => (
                <div key={p.id} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-muted/20 gap-2">
                  <span className="text-[11px] text-foreground font-medium uppercase truncate">{p.title}</span>
                  <button onClick={() => setSite(s => ({ ...s, pages: s.pages.filter(x => x.id !== p.id) }))} className="text-muted-foreground hover:text-red-400 shrink-0">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {site.buttons.map(b => (
                <div key={b.id} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-muted/20 gap-2">
                  <span className="text-[11px] text-foreground font-medium truncate">{b.label}</span>
                  <button onClick={() => setSite(s => ({ ...s, buttons: s.buttons.filter(x => x.id !== b.id) }))} className="text-muted-foreground hover:text-red-400 shrink-0">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      {/* ── AI Console ── */}
      <div
        className="shrink-0 border-t border-border bg-card/90 backdrop-blur-sm flex flex-col transition-all duration-200"
        style={{ height: consoleOpen ? 260 : 40 }}
      >
        {/* Console header */}
        <div className="flex items-center justify-between px-4 h-10 shrink-0 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Claude Console</span>
            <span className="text-[10px] text-muted-foreground/40">· /clean to reset</span>
          </div>
          <div className="flex items-center gap-3">
            {isPro ? (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                <span className="text-[11px]">{membershipTier === 'pro_max' ? '⭐⭐' : '⭐'}</span>
                <span className="text-[10px] font-semibold text-amber-400">
                  {membershipTier === 'pro_max' ? 'Pro Max · Unlimited' : 'Pro · Unlimited'}
                </span>
              </div>
            ) : (
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${
                limitReached
                  ? 'bg-red-500/10 border-red-500/20 text-red-400'
                  : promptWarning
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  : 'bg-muted/30 border-border text-muted-foreground'
              }`}>
                <span>{localPromptsUsed} / {FREE_PROMPT_LIMIT} prompts</span>
              </div>
            )}
            <button
              onClick={() => setConsoleOpen(o => !o)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {consoleOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {consoleOpen && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 min-h-0">
              {displayMsgs.length === 0 && !limitReached && (
                <p className="text-[11px] text-muted-foreground/40 text-center pt-2">
                  {initialHtml
                    ? 'Theme loaded — describe changes or ask Claude to modify it.'
                    : 'Describe your page. e.g. "Layout: top 15% header with menu, two content rows, bottom 15% footer"'}
                </p>
              )}
              {displayMsgs.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-1.5 rounded-xl text-[12px] leading-snug ${
                    msg.role === 'user'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted/40 text-muted-foreground'
                  }`}>
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

            {/* Input row */}
            <div className="px-4 pb-3 pt-1 shrink-0">
              {limitReached ? (
                <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2">
                    <Crown className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-[12px] text-red-400 font-medium">Free limit reached ({FREE_PROMPT_LIMIT} prompts)</span>
                  </div>
                  <a
                    href="/account"
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                  >
                    <Crown className="w-3 h-3" />
                    Upgrade to Pro
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
                  <Button
                    size="sm"
                    onClick={sendConsoleMsg}
                    disabled={generating || !consoleInput.trim()}
                    className="px-3"
                  >
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
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 w-96 space-y-4 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              {modal === 'title' && (
                <>
                  <h3 className="font-semibold text-foreground">Change Site Title</h3>
                  <input
                    autoFocus
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyTitle()}
                    placeholder="Site title"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                    <Button size="sm" onClick={applyTitle}>Apply</Button>
                  </div>
                </>
              )}

              {modal === 'menu' && (
                <>
                  <h3 className="font-semibold text-foreground">Add Menu Page</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">
                        Page title <span className="text-[10px] opacity-60">(shown ALL CAPS)</span>
                      </label>
                      <input
                        autoFocus
                        type="text"
                        value={formTitle}
                        onChange={e => setFormTitle(e.target.value)}
                        placeholder="e.g. About Us"
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">
                        Menu caption <span className="text-[10px] opacity-60">(shown in small caps)</span>
                      </label>
                      <input
                        type="text"
                        value={formCaption}
                        onChange={e => setFormCaption(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addPage()}
                        placeholder="e.g. Learn about our story"
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                    <Button size="sm" onClick={addPage} disabled={!formTitle.trim()}>Add Page</Button>
                  </div>
                </>
              )}

              {modal === 'button' && (
                <>
                  <h3 className="font-semibold text-foreground">Add Button Action</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Button label</label>
                      <input
                        autoFocus
                        type="text"
                        value={formBtnLabel}
                        onChange={e => setFormBtnLabel(e.target.value)}
                        placeholder="e.g. Learn More"
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Link URL</label>
                      <input
                        type="url"
                        value={formBtnUrl}
                        onChange={e => setFormBtnUrl(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addButton()}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                    <Button size="sm" onClick={addButton} disabled={!formBtnLabel.trim() || !formBtnUrl.trim()}>Add Button</Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

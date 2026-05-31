'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Layout, Box, Package, Loader2, CheckCircle2, X } from 'lucide-react'
import type { Template } from '@/types'

const DEMO_TEMPLATES: Template[] = [
  {
    template_id: '1',
    title: 'Minimal Agency',
    category: 'professional',
    type: '2d',
    preview_image: '',
    price: 13,
    description: 'Clean, professional agency site with smooth animations',
    published: true,
  },
  {
    template_id: '2',
    title: 'Portfolio Pro',
    category: 'professional',
    type: '2d',
    preview_image: '',
    price: 13,
    description: 'Showcase your work with a stunning portfolio layout',
    published: true,
  },
  {
    template_id: '3',
    title: 'Basic Starter',
    category: 'basic',
    type: '2d',
    preview_image: '',
    price: 0,
    description: 'Perfect starting point for any small website',
    published: true,
  },
  {
    template_id: '4',
    title: 'Digital Store',
    category: 'digital-products',
    type: '2d',
    preview_image: '',
    price: 13,
    description: 'Sell digital products with a conversion-optimized layout',
    published: true,
  },
  {
    template_id: '5',
    title: '3D Portfolio',
    category: 'professional',
    type: '3d',
    preview_image: '',
    price: 13,
    description: 'Immersive Three.js portfolio with stunning 3D effects',
    published: true,
  },
  {
    template_id: '6',
    title: '3D Product Showcase',
    category: 'digital-products',
    type: '3d',
    preview_image: '',
    price: 13,
    description: 'Show off your products with interactive 3D models',
    published: true,
  },
]

const filters = [
  { label: 'All', value: 'all', icon: Package },
  { label: '2D', value: '2d', icon: Layout },
  { label: '3D', value: '3d', icon: Box },
]

const categories = [
  { label: 'All Categories', value: 'all' },
  { label: 'Basic', value: 'basic' },
  { label: 'Professional', value: 'professional' },
  { label: 'Digital Products', value: 'digital-products' },
]

function TemplateGridCard({ template, onBuy, onGetFree, buying }: { template: Template; onBuy: (t: Template) => void; onGetFree: (t: Template) => void; buying: boolean }) {
  const gradients: Record<string, string> = {
    professional: 'from-blue-900/30 to-indigo-900/20',
    basic: 'from-emerald-900/30 to-teal-900/20',
    'digital-products': 'from-purple-900/30 to-pink-900/20',
  }
  const accents: Record<string, string> = {
    professional: 'text-blue-400 border-blue-500/20',
    basic: 'text-emerald-400 border-emerald-500/20',
    'digital-products': 'text-purple-400 border-purple-500/20',
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4 }}
      className="rounded-xl border border-border bg-card overflow-hidden flex flex-col group"
    >
      <div className={`aspect-[16/10] bg-gradient-to-br ${gradients[template.category]} flex items-center justify-center relative`}>
        <div className="text-center">
          <div className={`text-xs uppercase tracking-wider font-medium ${accents[template.category].split(' ')[0]}`}>
            {template.type.toUpperCase()} · {template.category.replace('-', ' ')}
          </div>
          <div className="text-3xl mt-2">
            {template.type === '3d' ? '🌐' : '🖥️'}
          </div>
        </div>
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge variant="secondary" className="text-[10px]">
            {template.type.toUpperCase()}
          </Badge>
        </div>
        {template.price === 0 && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">Free</Badge>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-semibold text-foreground text-sm">{template.title}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
        </div>
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-base font-bold text-primary">
            {template.price === 0 ? 'Free' : `$${template.price}`}
          </span>
          <Button
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => template.price === 0 ? onGetFree(template) : onBuy(template)}
            disabled={buying}
          >
            {buying ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : template.price === 0 ? 'Get Free' : 'Buy — $13'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default function MarketplaceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [buyingId, setBuyingId] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (searchParams.get('success') === 'template') {
      setShowSuccess(true)
      router.replace('/marketplace')
    }
  }, [searchParams, router])

  async function handleGetFree(template: Template) {
    setBuyingId(template.template_id)
    try {
      const res = await fetch('/api/website/free', { method: 'POST' })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      if (data.url) {
        router.push(`/dashboard?website=${encodeURIComponent(data.url)}`)
      }
    } finally {
      setBuyingId(null)
    }
  }

  async function handleBuy(template: Template) {
    if (template.price === 0) return
    setBuyingId(template.template_id)
    try {
      const res = await fetch('/api/stripe/template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.template_id, templateTitle: template.title }),
      })
      const data = await res.json()
      if (data.url) {
        router.push(data.url)
      }
    } finally {
      setBuyingId(null)
    }
  }

  const filtered = DEMO_TEMPLATES.filter((t) => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="px-8 py-6 space-y-6 max-w-6xl">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="flex-1">Purchase successful! Template is now available in your dashboard.</span>
            <button onClick={() => setShowSuccess(false)}><X className="w-3.5 h-3.5" /></button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Type filter */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-card border border-border">
          {filters.map((f) => {
            const Icon = f.icon
            return (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  typeFilter === f.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-3 h-3" />
                {f.label}
              </button>
            )
          })}
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1 flex-wrap">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategoryFilter(c.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                categoryFilter === c.value
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-border/80'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="ml-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 w-48"
          />
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        {filtered.length} template{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((template) => (
            <TemplateGridCard
              key={template.template_id}
              template={template}
              onBuy={handleBuy}
              onGetFree={handleGetFree}
              buying={buyingId === template.template_id}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 text-center"
        >
          <p className="text-muted-foreground text-sm">No templates match your filters.</p>
        </motion.div>
      )}
    </div>
  )
}

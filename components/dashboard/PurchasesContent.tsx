'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { LinkButton } from '@/components/ui/link-button'
import { ShoppingCart, ShoppingBag, Package, Globe, ExternalLink, Hammer } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Purchase, Website } from '@/types'
import { STARTER_TEMPLATES } from '@/lib/templates/starters'

interface PurchasesContentProps {
  purchases: Purchase[]
  websites: Website[]
}

// Extra, purely-local optional field: renders as the card's background image
// once real preview data is wired in. Falls back to a gradient + icon backdrop.
type WebsiteWithPreview = Website & { previewImage?: string }
type PurchaseWithPreview = Purchase & { previewImage?: string }

const CATEGORY_GRADIENTS: Record<string, string> = {
  professional: 'from-blue-950 via-indigo-900 to-blue-800',
  basic: 'from-emerald-950 via-teal-900 to-emerald-800',
  'digital-products': 'from-purple-950 via-fuchsia-900 to-purple-800',
}
const DEFAULT_GRADIENT = 'from-slate-900 via-slate-800 to-slate-700'

function StackCard({
  previewImage,
  gradient,
  icon,
  title,
  subtitle,
  statusBadge,
  actions,
  delay,
}: {
  previewImage?: string
  gradient: string
  icon: React.ReactNode
  title: string
  subtitle?: string
  statusBadge?: React.ReactNode
  actions: React.ReactNode
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl border border-border overflow-hidden aspect-[4/5] flex flex-col justify-end"
    >
      {/* Background — real preview image once available, otherwise a rich gradient + icon backdrop */}
      {previewImage ? (
        <Image
          src={previewImage}
          alt={title}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <div className="text-white/15 transition-transform duration-500 group-hover:scale-110 [&>svg]:w-20 [&>svg]:h-20">
            {icon}
          </div>
        </div>
      )}

      {/* Permanent bottom-to-top gradient so headline stays readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent transition-opacity group-hover:from-black/95" />

      {statusBadge && <div className="absolute top-3 left-3 z-10">{statusBadge}</div>}

      {/* Headline + actions, pinned over the image */}
      <div className="relative z-10 p-4 flex flex-col gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-white text-base leading-tight tracking-tight drop-shadow-sm truncate">{title}</h3>
          {subtitle && <p className="text-xs text-white/60 mt-1 truncate">{subtitle}</p>}
        </div>
        <div className="flex items-center justify-end gap-2">{actions}</div>
      </div>
    </motion.div>
  )
}

export default function PurchasesContent({ purchases, websites }: PurchasesContentProps) {
  const hasAnything = purchases.length > 0 || websites.length > 0

  if (!hasAnything) {
    return (
      <div className="px-8 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-dashed border-border p-12 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No purchases yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
            Browse the marketplace to find premium templates for your next project.
          </p>
          <LinkButton href="/marketplace">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Go to Marketplace
          </LinkButton>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="px-8 py-8 max-w-5xl space-y-8">
      {websites.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Deployed Sites</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {websites.map((site, i) => {
              const s = site as WebsiteWithPreview
              return (
                <StackCard
                  key={site.website_id}
                  delay={i * 0.05}
                  previewImage={s.previewImage}
                  gradient={DEFAULT_GRADIENT}
                  icon={<Globe />}
                  title={site.domain || site.slug || site.website_id}
                  subtitle={new Date(site.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  statusBadge={
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] backdrop-blur-sm">
                      {site.hosting_status === 'active' ? 'Live' : site.hosting_status}
                    </Badge>
                  }
                  actions={
                    <>
                      <a
                        href={`/builder?siteId=${site.website_id}`}
                        title="Build"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 transition-colors"
                      >
                        <Hammer className="w-3.5 h-3.5" />
                      </a>
                      {site.domain && (
                        <a
                          href={site.domain}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open website"
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </>
                  }
                />
              )
            })}
          </div>
        </div>
      )}

      {purchases.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Template Purchases</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {purchases.map((purchase, i) => {
              const p = purchase as PurchaseWithPreview
              const tmpl = STARTER_TEMPLATES.find(t => t.id === purchase.template_id)
              return (
                <StackCard
                  key={purchase.purchase_id}
                  delay={i * 0.05}
                  previewImage={p.previewImage}
                  gradient={tmpl ? CATEGORY_GRADIENTS[tmpl.category] ?? DEFAULT_GRADIENT : DEFAULT_GRADIENT}
                  icon={<Package />}
                  title={tmpl?.title || `Template #${purchase.template_id}`}
                  subtitle={new Date(purchase.purchase_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  statusBadge={
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wider backdrop-blur-sm bg-black/40 text-white border-white/10">
                      Purchased
                    </Badge>
                  }
                  actions={
                    <span className="text-[10px] font-mono text-white/70 truncate max-w-[8rem]" title={purchase.stripe_payment_id}>
                      {purchase.stripe_payment_id.slice(0, 12)}…
                    </span>
                  }
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { LinkButton } from '@/components/ui/link-button'
import { ShoppingCart, ShoppingBag, Package, Globe, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Purchase, Website } from '@/types'

interface PurchasesContentProps {
  purchases: Purchase[]
  websites: Website[]
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
          {websites.map((site, i) => (
            <motion.div
              key={site.website_id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{site.domain || site.slug || site.website_id}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(site.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                {site.hosting_status === 'active' ? 'Live' : site.hosting_status}
              </Badge>
              {site.domain && (
                <a href={site.domain} target="_blank" rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {purchases.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Template Purchases</h2>
          {purchases.map((purchase, i) => (
            <motion.div
              key={purchase.purchase_id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Template #{purchase.template_id}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(purchase.purchase_date).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">Payment</p>
                <p className="text-xs font-mono text-foreground truncate max-w-32">{purchase.stripe_payment_id.slice(0, 16)}…</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

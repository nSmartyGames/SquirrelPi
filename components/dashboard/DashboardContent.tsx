'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LinkButton } from '@/components/ui/link-button'
import { Badge } from '@/components/ui/badge'
import {
  Globe,
  Plus,
  Zap,
  Clock,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Activity,
  ExternalLink,
  CheckCircle2,
  Handshake,
  Hammer,
  X,
} from 'lucide-react'
import type { Website } from '@/types'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

interface DashboardContentProps {
  userId: string
  websites: Website[]
  newWebsiteUrl?: string
  partnerWebsites?: Website[]
  showPartnerSites?: boolean
}

export default function DashboardContent({ userId, websites, newWebsiteUrl, partnerWebsites = [], showPartnerSites = false }: DashboardContentProps) {
  const stats = [
    { label: 'Websites', value: String(websites.length), icon: Globe, color: 'text-emerald-400' },
    { label: 'Templates', value: String(new Set(websites.map(w => w.template_id).filter(Boolean)).size), icon: ShoppingBag, color: 'text-blue-400' },
    { label: 'AI Projects', value: '0', icon: Sparkles, color: 'text-purple-400' },
    { label: 'Live Sites', value: String(websites.filter(w => w.hosting_status === 'active').length), icon: Activity, color: 'text-orange-400' },
  ]
  const router = useRouter()
  const [showBanner, setShowBanner] = useState(!!newWebsiteUrl)

  function dismissBanner() {
    setShowBanner(false)
    router.replace('/dashboard')
  }

  return (
    <div className="px-8 py-8 space-y-8 max-w-5xl">
      <AnimatePresence>
        {showBanner && newWebsiteUrl && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="flex-1">Your site is live!</span>
            <a
              href={newWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 underline underline-offset-2 hover:text-emerald-300"
            >
              {newWebsiteUrl} <ExternalLink className="w-3 h-3" />
            </a>
            <button onClick={dismissBanner}><X className="w-3.5 h-3.5" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-4 gap-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              variants={item}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-4"
      >
        <motion.div variants={item}>
          <LinkButton href="/marketplace" className="block h-auto p-0 bg-transparent border-0 hover:bg-transparent">
            <div className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors cursor-pointer group w-full text-left">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">Browse Templates</h3>
              <p className="text-xs text-muted-foreground mt-1">Find the perfect design</p>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary mt-3 transition-colors" />
            </div>
          </LinkButton>
        </motion.div>

        <motion.div variants={item}>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">AI Builder</h3>
            <p className="text-xs text-muted-foreground mt-1">Generate with a prompt</p>
            <div className="flex items-center gap-1.5 mt-3">
              <Badge variant="secondary" className="text-[10px]">Coming Soon</Badge>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <LinkButton href="/go-live" className="block h-auto p-0 bg-transparent border-0 hover:bg-transparent">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 hover:bg-primary/10 transition-colors cursor-pointer group w-full text-left">
              <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-sm text-primary">Go Live</h3>
              <p className="text-xs text-muted-foreground mt-1">Deploy to the web instantly</p>
              <ArrowRight className="w-3.5 h-3.5 text-primary mt-3" />
            </div>
          </LinkButton>
        </motion.div>
      </motion.div>

      {/* Websites */}
      {websites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-dashed border-border p-12 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Globe className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No websites yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
            Create your first website by choosing a template from the marketplace or using the AI builder.
          </p>
          <div className="flex items-center justify-center gap-3">
            <LinkButton href="/marketplace">
              <Plus className="w-4 h-4 mr-2" />
              New Website
            </LinkButton>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your Websites</h2>
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
                <p className="text-sm font-medium text-foreground truncate">{site.domain}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(site.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">Live</Badge>
              <a href={`/builder?siteId=${site.website_id}`} title="Build"
                className="text-muted-foreground hover:text-primary transition-colors">
                <Hammer className="w-4 h-4" />
              </a>
              {site.domain && (
                <a href={site.domain} target="_blank" rel="noopener noreferrer" title="Open website"
                  className="text-muted-foreground hover:text-primary transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Partner Sites (admin-only) */}
      {showPartnerSites && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Partner Sites</h2>
          {partnerWebsites.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-6 text-center">
              <Handshake className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No partner sites yet</p>
            </div>
          )}
          {partnerWebsites.map((site, i) => {
            let businessName = site.external_tenant_id
            try {
              businessName = site.business_data ? JSON.parse(site.business_data).name : businessName
            } catch {}
            return (
              <motion.div
                key={site.website_id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Handshake className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{businessName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {site.partner_id} · {site.vertical} · {new Date(site.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <Badge
                  className={
                    site.html_content
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]'
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-[10px]'
                  }
                >
                  {site.html_content ? 'Generated' : 'Pending'}
                </Badge>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Recent Activity
        </h2>
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <Clock className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No activity yet</p>
        </div>
      </motion.div>
    </div>
  )
}

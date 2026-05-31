'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { Badge } from '@/components/ui/badge'
import {
  Star,
  Sparkles,
  Globe,
  Lock,
  Check,
  Zap,
  BookOpen,
  Headphones,
  Gift,
  ArrowRight,
  Loader2,
} from 'lucide-react'

const memberPerks = [
  {
    icon: Sparkles,
    title: 'AI Generation Credits',
    desc: '50 AI-powered website generations per month',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    locked: false,
  },
  {
    icon: Globe,
    title: 'Free Cloudflare Pages Publishing',
    desc: 'Deploy to yourproject.pages.dev at no extra cost',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    locked: false,
  },
  {
    icon: BookOpen,
    title: 'Template Library Access',
    desc: 'Browse and preview all templates before buying',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    locked: false,
  },
  {
    icon: Headphones,
    title: 'Priority Support',
    desc: 'Get responses within 24 hours',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    locked: false,
  },
  {
    icon: Gift,
    title: 'Monthly Free Template',
    desc: 'One free template credit every month',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    locked: true,
  },
  {
    icon: Zap,
    title: 'Early Access Features',
    desc: 'Try new features before public release',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    locked: true,
  },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

interface MembersContentProps {
  userId: string
}

export default function MembersContent({ userId }: MembersContentProps) {
  const [deploying, setDeploying] = useState(false)
  const [deployResult, setDeployResult] = useState<{ url: string } | null>(null)
  const [siteName, setSiteName] = useState('')

  const handleQuickDeploy = async () => {
    if (!siteName.trim()) return
    setDeploying(true)
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: siteName.trim().toLowerCase().replace(/\s+/g, '-'),
          siteName: siteName.trim(),
        }),
      })
      const data = await res.json()
      setDeployResult({ url: data.pagesUrl || data.url })
    } catch {
      setDeployResult({ url: 'Deployment failed. Check CF credentials.' })
    }
    setDeploying(false)
  }

  return (
    <div className="px-8 py-8 max-w-5xl space-y-10">
      {/* Status banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 flex items-center gap-5"
      >
        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
          <Star className="w-7 h-7 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-bold text-foreground text-lg">Starter Member</h2>
            <Badge className="bg-primary/20 text-primary border-primary/20 text-xs">Active</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            $3/month · Renews automatically · Full access to member benefits
          </p>
        </div>
        <LinkButton href="/account" variant="outline" size="sm" className="shrink-0">
          Manage
        </LinkButton>
      </motion.div>

      {/* Perks grid */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Your Benefits
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-4"
        >
          {memberPerks.map((perk) => {
            const Icon = perk.icon
            return (
              <motion.div
                key={perk.title}
                variants={item}
                className={`rounded-xl border bg-card p-5 flex flex-col gap-3 relative ${
                  perk.locked ? 'border-border opacity-60' : 'border-border'
                }`}
              >
                {perk.locked && (
                  <div className="absolute top-3 right-3">
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                )}
                <div className={`w-9 h-9 rounded-lg ${perk.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${perk.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{perk.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{perk.desc}</p>
                </div>
                {!perk.locked && (
                  <div className="flex items-center gap-1 text-[10px] text-primary mt-auto">
                    <Check className="w-3 h-3" />
                    Included
                  </div>
                )}
                {perk.locked && (
                  <p className="text-[10px] text-muted-foreground mt-auto">Coming soon</p>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* Cloudflare Pages Quick Deploy */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-indigo-900/10 p-7 space-y-5"
      >
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-foreground">Free Cloudflare Pages Deploy</h2>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20 text-[10px]">FREE</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Publish any website to <span className="text-blue-400 font-mono text-xs">yourproject.pages.dev</span> instantly — no hosting fees, forever free on Cloudflare's edge network.
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-2">
          {[
            'Global CDN — 200+ edge locations',
            'Automatic HTTPS / SSL',
            'Custom domain support',
            'Unlimited bandwidth',
            'Instant cache invalidation',
            'Zero monthly cost',
          ].map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {!deployResult ? (
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Site name (e.g. my-coffee-shop)"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickDeploy()}
              className="flex-1 px-3 py-2 rounded-lg bg-background/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            <Button
              onClick={handleQuickDeploy}
              disabled={deploying || !siteName.trim()}
              className="gap-2 shrink-0"
            >
              {deploying ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Deploying…</>
              ) : (
                <><Zap className="w-4 h-4" /> Deploy Free</>
              )}
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm font-semibold text-emerald-400">Deployed!</p>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">{deployResult.url}</p>
            </div>
            <div className="flex gap-2">
              <a
                href={deployResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 underline underline-offset-2"
              >
                Visit site
              </a>
              <button
                onClick={() => { setDeployResult(null); setSiteName('') }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Deploy another
              </button>
            </div>
          </motion.div>
        )}

        <p className="text-[10px] text-muted-foreground">
          Requires Cloudflare API token configured in settings. Custom HTML from AI Builder automatically deployed.
        </p>
      </motion.section>

      {/* Upgrade teaser */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-border bg-card p-5 flex items-center justify-between gap-4"
      >
        <div>
          <h3 className="font-semibold text-foreground text-sm">Refer a friend</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Get 1 month free for every referral who subscribes.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
          Share link <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </motion.div>
    </div>
  )
}

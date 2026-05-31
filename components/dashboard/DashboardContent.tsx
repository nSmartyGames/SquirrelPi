'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
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
} from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

const stats = [
  { label: 'Websites', value: '0', icon: Globe, color: 'text-emerald-400' },
  { label: 'Templates', value: '0', icon: ShoppingBag, color: 'text-blue-400' },
  { label: 'AI Projects', value: '0', icon: Sparkles, color: 'text-purple-400' },
  { label: 'Live Sites', value: '0', icon: Activity, color: 'text-orange-400' },
]

interface DashboardContentProps {
  userId: string
}

export default function DashboardContent({ userId }: DashboardContentProps) {
  return (
    <div className="px-8 py-8 space-y-8 max-w-5xl">
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

      {/* Websites Empty State */}
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
          <LinkButton href="/templates/2d" variant="ghost">
            Browse Templates
          </LinkButton>
        </div>
      </motion.div>

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

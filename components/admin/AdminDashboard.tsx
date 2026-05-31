'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  ShoppingBag,
  Globe,
  DollarSign,
  TrendingUp,
  Settings,
  Plus,
  Trash2,
  Eye,
  Edit3,
  Shield,
  Activity,
  Server,
  Layers,
} from 'lucide-react'

const stats = [
  { label: 'Total Users', value: '—', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Active Members', value: '—', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Templates Sold', value: '—', icon: ShoppingBag, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { label: 'Revenue', value: '$—', icon: DollarSign, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { label: 'Live Websites', value: '—', icon: Globe, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { label: 'CF Deployments', value: '—', icon: Server, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
]

const DEMO_TEMPLATES = [
  { id: '1', title: 'Minimal Agency', type: '2D', category: 'Professional', price: 13, published: true, sales: 0 },
  { id: '2', title: 'Portfolio Pro', type: '2D', category: 'Professional', price: 13, published: true, sales: 0 },
  { id: '3', title: 'Basic Starter', type: '2D', category: 'Basic', price: 0, published: true, sales: 0 },
  { id: '4', title: '3D Portfolio', type: '3D', category: 'Professional', price: 13, published: false, sales: 0 },
]

const tabs = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'templates', label: 'Templates', icon: Layers },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'deployments', label: 'CF Deployments', icon: Server },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [templates, setTemplates] = useState(DEMO_TEMPLATES)

  const togglePublish = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, published: !t.published } : t))
    )
  }

  return (
    <div className="px-8 py-8 max-w-6xl space-y-6">
      {/* Tab nav */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-card border border-border w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={item} className="grid grid-cols-3 gap-4">
            {stats.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                    <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                      <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                </div>
              )
            })}
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm text-foreground">Revenue Overview</h3>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Memberships ($3/mo)', value: '$0' },
                  { label: 'Template sales ($13)', value: '$0' },
                  { label: 'Total MRR', value: '$0' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-semibold text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Server className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-sm text-foreground">Cloudflare Status</h3>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Active Projects', value: '0' },
                  { label: 'Total Deployments', value: '0' },
                  { label: 'Bandwidth Used', value: '0 GB' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-semibold text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[11px] text-emerald-400">Cloudflare API connected</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Templates management */}
      {activeTab === 'templates' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{templates.length} templates total</p>
            <Button size="sm" className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Add Template
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sales</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {templates.map((tpl, i) => (
                  <tr
                    key={tpl.id}
                    className={`border-b border-border last:border-0 hover:bg-white/2 transition-colors`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">{tpl.title}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-[10px]">{tpl.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-primary font-semibold">
                      {tpl.price === 0 ? 'Free' : `$${tpl.price}`}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{tpl.sales}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => togglePublish(tpl.id)}>
                        <Badge
                          className={`text-[10px] cursor-pointer ${
                            tpl.published
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {tpl.published ? 'Published' : 'Draft'}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-dashed border-border p-12 text-center"
        >
          <Users className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground mb-1">User list loads from Airtable</p>
          <p className="text-xs text-muted-foreground">Configure AIRTABLE_API_KEY to view real users.</p>
        </motion.div>
      )}

      {/* CF Deployments */}
      {activeTab === 'deployments' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-cyan-400" />
              <h3 className="font-semibold text-foreground">Cloudflare Pages Projects</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              All member deployments appear here. Each project is prefixed <span className="font-mono text-xs text-cyan-400">sq-</span> to avoid collisions.
            </p>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {[
                { label: 'Free tier limit', value: '500 deploys/month' },
                { label: 'Bandwidth', value: 'Unlimited' },
                { label: 'Domains', value: '.pages.dev + custom' },
              ].map((f) => (
                <div key={f.label} className="rounded-lg border border-border bg-card p-3">
                  <p className="text-muted-foreground">{f.label}</p>
                  <p className="font-semibold text-foreground mt-0.5">{f.value}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Live deployment list requires CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID.
            </p>
          </div>
        </motion.div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 max-w-lg"
        >
          {[
            { label: 'Membership Price', value: '$3 / month', editable: false },
            { label: 'Template Price', value: '$13 per template', editable: false },
            { label: 'Cloudflare Account ID', value: process.env.NEXT_PUBLIC_CF_ACCOUNT_ID || 'Not set', editable: false },
            { label: 'Admin User IDs', value: 'Set via ADMIN_USER_IDS env var', editable: false },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{s.value}</p>
              </div>
              {s.editable && (
                <Button variant="ghost" size="sm" className="h-7 gap-1">
                  <Edit3 className="w-3 h-3" /> Edit
                </Button>
              )}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

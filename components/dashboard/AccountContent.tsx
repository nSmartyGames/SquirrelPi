'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { Badge } from '@/components/ui/badge'
import {
  User,
  CreditCard,
  Globe,
  Star,
  Check,
} from 'lucide-react'

interface AccountContentProps {
  name: string
  email: string
  userId: string
  membershipStatus: 'active' | 'cancelled' | 'past_due' | null
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

export default function AccountContent({ name, email, userId, membershipStatus }: AccountContentProps) {
  const isActive = membershipStatus === 'active'
  const handleSubscribe = async () => {
    const res = await fetch('/api/stripe/membership', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  return (
    <div className="px-8 py-8 max-w-3xl space-y-6">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground text-lg">{name || 'User'}</h2>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
          <Badge variant="secondary" className="ml-auto">{isActive ? 'Member' : 'Free Plan'}</Badge>
        </div>
      </motion.div>

      {/* Membership */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
              <Star className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Starter Membership</h3>
              <p className="text-xs text-muted-foreground">$3/month</p>
            </div>
          </div>
          <Badge className={isActive
            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs"
            : "bg-primary/20 text-primary border-primary/20 text-xs"
          }>
            {isActive ? 'Active' : membershipStatus === 'cancelled' ? 'Cancelled' : membershipStatus === 'past_due' ? 'Past Due' : 'Not Active'}
          </Badge>
        </div>

        <ul className="space-y-2">
          {[
            'Account access',
            'AI generation credits',
            'Website editing',
            'Basic publishing',
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-3.5 h-3.5 text-primary shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        {!isActive && (
          <Button onClick={handleSubscribe} className="w-full">
            Subscribe — $19/month
          </Button>
        )}
      </motion.div>

      {/* Domains */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border bg-card p-6 space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Globe className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="font-semibold text-foreground">Domains</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          No domains registered yet. Purchase a domain and connect it to your website.
        </p>
        <Button variant="outline" className="gap-2">
          <Globe className="w-4 h-4" />
          Search Domains
        </Button>
      </motion.div>

      {/* Meta Integrations */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-border bg-card p-6 space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <FacebookIcon className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Meta Business</h3>
            <p className="text-xs text-muted-foreground">Connect Facebook & Instagram</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border p-3 flex items-center gap-3">
            <FacebookIcon className="w-4 h-4 text-blue-400" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">Facebook</p>
              <p className="text-[10px] text-muted-foreground">Not connected</p>
            </div>
            <Button variant="ghost" size="sm" className="h-6 text-xs px-2">Connect</Button>
          </div>
          <div className="rounded-lg border border-border p-3 flex items-center gap-3">
            <InstagramIcon className="w-4 h-4 text-pink-400" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">Instagram</p>
              <p className="text-[10px] text-muted-foreground">Not connected</p>
            </div>
            <Button variant="ghost" size="sm" className="h-6 text-xs px-2">Connect</Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

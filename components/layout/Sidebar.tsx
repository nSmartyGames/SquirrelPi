'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { UserButton } from '@clerk/nextjs'
import {
  Info,
  Layout,
  Box,
  ShoppingBag,
  Globe,
  ShoppingCart,
  User,
  Zap,
  Squirrel,
  Star,
  Shield,
  PenTool,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'About', href: '/', icon: Info, accent: false },
  { label: '2D Templates', href: '/templates/2d', icon: Layout, accent: false },
  { label: '3D Templates', href: '/templates/3d', icon: Box, accent: false },
  { label: 'Marketplace', href: '/marketplace', icon: ShoppingBag, accent: false },
  { label: 'Dashboard', href: '/dashboard', icon: Globe, accent: false },
  { label: 'My Stack', href: '/dashboard/purchases', icon: ShoppingCart, accent: false },
  { label: 'Site Builder', href: '/builder', icon: PenTool, accent: false },
  { label: 'Members', href: '/members', icon: Star, accent: 'gold' as const },
  { label: 'Account', href: '/account', icon: User, accent: false },
  { label: 'Admin', href: '/admin', icon: Shield, accent: 'red' as const },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-[20%] min-w-[200px] max-w-[260px] flex flex-col bg-sidebar border-r border-sidebar-border z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Squirrel className="w-4 h-4 text-primary" />
        </div>
        <span className="font-semibold text-sm tracking-wide text-foreground">
          Squirrel Pi
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active =
            item.href === '/'
              ? pathname === '/'
              : item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                  active
                    ? item.accent === 'gold'
                      ? 'bg-yellow-500/15 text-yellow-400'
                      : item.accent === 'red'
                      ? 'bg-red-500/15 text-red-400'
                      : 'bg-primary/15 text-primary'
                    : item.accent === 'gold'
                    ? 'text-yellow-500/70 hover:text-yellow-400 hover:bg-yellow-500/10'
                    : item.accent === 'red'
                    ? 'text-red-500/70 hover:text-red-400 hover:bg-red-500/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
                {item.accent === 'gold' && !active && (
                  <span className="ml-auto text-[9px] font-semibold uppercase tracking-wider text-yellow-500/60 bg-yellow-500/10 px-1.5 py-0.5 rounded-full">PRO</span>
                )}
                {active && (
                  <motion.div
                    layoutId="active-pill"
                    className={cn(
                      'ml-auto w-1 h-4 rounded-full',
                      item.accent === 'gold' ? 'bg-yellow-400' : item.accent === 'red' ? 'bg-red-400' : 'bg-primary'
                    )}
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Go Live */}
      <div className="px-3 pb-4">
        <Link href="/go-live">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 border border-primary/20 cursor-pointer group glow-green-sm hover:bg-primary/15 transition-all"
          >
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
            </span>
            <span className="text-sm font-semibold text-primary">Go Live</span>
            <Zap className="w-3.5 h-3.5 text-primary ml-auto" />
          </motion.div>
        </Link>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-t border-sidebar-border flex items-center gap-3">
        <UserButton />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground truncate">Account</p>
        </div>
      </div>
    </aside>
  )
}

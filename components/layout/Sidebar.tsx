'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { UserButton } from '@clerk/nextjs'
import {
  Info,
  ShoppingBag,
  Globe,
  ShoppingCart,
  User,
  Zap,
  Squirrel,
  Star,
  Shield,
  PenTool,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from './SidebarContext'

const navItems = [
  { label: 'About', href: '/', icon: Info, accent: false },
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
  const { collapsed, toggle, setCollapsed } = useSidebar()
  const autoCollapsed = useRef(false)

  useEffect(() => {
    if (pathname.startsWith('/builder') && !autoCollapsed.current) {
      autoCollapsed.current = true
      setCollapsed(true)
    } else if (!pathname.startsWith('/builder')) {
      autoCollapsed.current = false
    }
  }, [pathname, setCollapsed])

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full flex flex-col bg-sidebar border-r border-sidebar-border z-40 transition-all duration-200',
        collapsed ? 'w-11' : 'w-[20%] min-w-[200px] max-w-[260px]'
      )}
    >
      {/* Collapse toggle — centered on the right border */}
      <button
        onClick={toggle}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-border/50 z-50 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Logo */}
      {collapsed ? (
        <div className="flex items-center justify-center py-5 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <Squirrel className="w-4 h-4 text-primary" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-5 py-6 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <Squirrel className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-sm tracking-wide text-foreground">
            Squirrel Pi
          </span>
        </div>
      )}

      {/* Nav */}
      <nav
        className={cn(
          'flex-1 py-4 overflow-y-auto',
          collapsed ? 'px-1.5 space-y-1' : 'px-3 space-y-1'
        )}
      >
        {navItems.map((item) => {
          const active =
            item.href === '/'
              ? pathname === '/'
              : item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
          const Icon = item.icon

          if (collapsed) {
            return (
              <Link key={item.href} href={item.href} title={item.label}>
                <div
                  className={cn(
                    'w-8 h-8 mx-auto rounded-lg flex items-center justify-center transition-colors cursor-pointer',
                    active
                      ? item.accent === 'gold'
                        ? 'bg-yellow-500/15'
                        : item.accent === 'red'
                        ? 'bg-red-500/15'
                        : 'bg-primary/15'
                      : 'hover:bg-white/5'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5',
                      active
                        ? item.accent === 'gold'
                          ? 'text-yellow-400'
                          : item.accent === 'red'
                          ? 'text-red-400'
                          : 'text-primary'
                        : item.accent === 'gold'
                        ? 'text-yellow-500/70'
                        : item.accent === 'red'
                        ? 'text-red-500/70'
                        : 'text-muted-foreground'
                    )}
                  />
                </div>
              </Link>
            )
          }

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
      <div className={cn('pb-4', collapsed ? 'px-1.5' : 'px-3')}>
        <Link href="/go-live" title="Go Live">
          {collapsed ? (
            <div className="w-8 h-8 mx-auto rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center cursor-pointer hover:bg-primary/15 transition-colors">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
              </span>
            </div>
          ) : (
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
          )}
        </Link>
      </div>

      {/* User */}
      <div
        className={cn(
          'border-t border-sidebar-border flex items-center',
          collapsed ? 'px-2 py-3 justify-center' : 'px-4 py-4 gap-3'
        )}
      >
        <UserButton />
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">Account</p>
          </div>
        )}
      </div>
    </aside>
  )
}

'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { ArrowRight, Sparkles, Layout, Box } from 'lucide-react'
import { LinkButton } from '@/components/ui/link-button'
import GreenSquare from '@/components/templates/GreenSquare'
import Link from 'next/link'

const RainbowSphere = dynamic(() => import('@/components/templates/RainbowSphere'), {
  ssr: false,
})

const featuredTemplates = [
  {
    id: '1',
    title: 'Basic Theme',
    tag: 'Free',
    type: '2d' as const,
    color: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/20',
  },
  {
    id: '2',
    title: 'Professional Theme',
    tag: '$13',
    type: '2d' as const,
    color: 'from-blue-500/20 to-indigo-500/10',
    border: 'border-blue-500/20',
  },
  {
    id: '3',
    title: 'Digital Products Theme',
    tag: '$13',
    type: '3d' as const,
    color: 'from-purple-500/20 to-pink-500/10',
    border: 'border-purple-500/20',
  },
]

const categories = [
  {
    title: 'Basic Websites',
    description: 'Clean, minimal templates to get online fast',
    href: '/marketplace?category=basic',
    gradient: 'from-emerald-900/40 to-teal-900/20',
    accent: 'text-emerald-400',
    icon: '🌱',
  },
  {
    title: 'Professional Websites',
    description: 'Polished designs for agencies and businesses',
    href: '/marketplace?category=professional',
    gradient: 'from-blue-900/40 to-indigo-900/20',
    accent: 'text-blue-400',
    icon: '💼',
  },
  {
    title: 'Digital Products',
    description: 'Sell courses, ebooks, and digital downloads',
    href: '/marketplace?category=digital-products',
    gradient: 'from-purple-900/40 to-pink-900/20',
    accent: 'text-purple-400',
    icon: '⚡',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function HomepageContent() {
  return (
    <div className="px-8 py-10 max-w-5xl mx-auto space-y-16">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-2">
          <Sparkles className="w-3 h-3" />
          AI-Powered Website Builder
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          SQUIRREL PI
        </h1>
        <p className="text-xl text-muted-foreground max-w-lg mx-auto">
          2D / 3D Website Templates
        </p>
        <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
          Build stunning websites with AI assistance. Choose from premium templates,
          customize with ease, and publish in one click.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <LinkButton href="/marketplace" size="lg" className="gap-2">
            Browse Templates <ArrowRight className="w-4 h-4" />
          </LinkButton>
          <LinkButton href="/dashboard" variant="ghost" size="lg">
            My Websites
          </LinkButton>
        </div>
      </motion.section>

      {/* 3D / 2D Visual Entry Points */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid grid-cols-2 gap-6"
      >
        <Link href="/templates/3d">
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="relative h-52 rounded-2xl border border-border bg-card overflow-hidden cursor-pointer group"
          >
            <div className="absolute inset-0">
              <RainbowSphere className="w-full h-full opacity-80" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <div className="flex items-center gap-2 mb-1">
                <Box className="w-4 h-4 text-primary" />
                <span className="text-xs text-primary font-medium uppercase tracking-wider">3D Templates</span>
              </div>
              <p className="text-sm text-muted-foreground">Immersive Three.js experiences</p>
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-4 h-4 text-primary" />
            </div>
          </motion.div>
        </Link>

        <Link href="/templates/2d">
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="relative h-52 rounded-2xl border border-border bg-card overflow-hidden cursor-pointer group"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <GreenSquare className="w-40 h-40" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <div className="flex items-center gap-2 mb-1">
                <Layout className="w-4 h-4 text-primary" />
                <span className="text-xs text-primary font-medium uppercase tracking-wider">2D Templates</span>
              </div>
              <p className="text-sm text-muted-foreground">Clean, responsive layouts</p>
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-4 h-4 text-primary" />
            </div>
          </motion.div>
        </Link>
      </motion.section>

      {/* Featured Templates */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Featured Templates</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Hand-picked for quality</p>
          </div>
          <LinkButton href="/marketplace" variant="ghost" size="sm" className="gap-1 text-primary">
            View all <ArrowRight className="w-3 h-3" />
          </LinkButton>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-4"
        >
          {featuredTemplates.map((tpl) => (
            <motion.div key={tpl.id} variants={item}>
              <Link href={`/marketplace?type=${tpl.type}`}>
                <motion.div
                  whileHover={{ y: -3 }}
                  className={`rounded-xl border ${tpl.border} bg-gradient-to-br ${tpl.color} p-5 h-36 flex flex-col justify-between cursor-pointer transition-shadow hover:shadow-lg`}
                >
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    {tpl.type === '3d' ? '3D' : '2D'} Template
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{tpl.title}</h3>
                    <p className="text-primary font-bold text-base mt-0.5">{tpl.tag}</p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Categories */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Browse by Category</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Find the perfect template for your needs</p>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-4"
        >
          {categories.map((cat) => (
            <motion.div key={cat.title} variants={item}>
              <Link href={cat.href}>
                <motion.div
                  whileHover={{ y: -3, scale: 1.01 }}
                  className={`rounded-xl border border-border bg-gradient-to-br ${cat.gradient} p-5 h-40 flex flex-col gap-3 cursor-pointer group`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <h3 className={`font-semibold text-sm ${cat.accent}`}>{cat.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{cat.description}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors mt-auto" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* AI Builder CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 text-center space-y-4"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Build with AI</h2>
          <p className="text-muted-foreground mt-2 text-sm max-w-sm mx-auto">
            Describe your vision. Our AI generates a complete website — layout, copy, images, and styling.
          </p>
        </div>
        <LinkButton href="/dashboard" size="lg" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Start Building
        </LinkButton>
      </motion.section>
    </div>
  )
}

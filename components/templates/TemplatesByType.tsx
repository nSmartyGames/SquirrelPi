'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import dynamic from 'next/dynamic'
import GreenSquare from './GreenSquare'

const RainbowSphere = dynamic(() => import('./RainbowSphere'), { ssr: false })

const DEMO_2D = [
  { id: '1', title: 'Minimal Agency', category: 'professional', price: 13, desc: 'Clean agency site with scroll animations' },
  { id: '2', title: 'Portfolio Pro', category: 'professional', price: 13, desc: 'Stunning portfolio with grid layout' },
  { id: '3', title: 'Basic Starter', category: 'basic', price: 0, desc: 'Simple and fast to customize' },
  { id: '4', title: 'Digital Store', category: 'digital-products', price: 13, desc: 'Sell digital products with ease' },
  { id: '5', title: 'Landing Page', category: 'basic', price: 0, desc: 'High-converting landing page' },
  { id: '6', title: 'Blog Platform', category: 'professional', price: 13, desc: 'Modern blogging experience' },
]

const DEMO_3D = [
  { id: '5', title: '3D Portfolio', category: 'professional', price: 13, desc: 'Immersive Three.js portfolio' },
  { id: '6', title: '3D Product Showcase', category: 'digital-products', price: 13, desc: 'Interactive 3D product views' },
  { id: '7', title: '3D Agency', category: 'professional', price: 13, desc: 'Stunning 3D agency experience' },
]

export default function TemplatesByType({ type }: { type: '2d' | '3d' }) {
  const templates = type === '2d' ? DEMO_2D : DEMO_3D

  return (
    <div className="px-8 py-8 max-w-5xl space-y-8">
      {/* Visual header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-44 rounded-2xl border border-border bg-card overflow-hidden"
      >
        {type === '3d' ? (
          <RainbowSphere className="absolute inset-0 opacity-70" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <GreenSquare className="w-36 h-36" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent flex items-center">
          <div className="px-8">
            <Badge variant="secondary" className="text-xs mb-2">{type.toUpperCase()} Collection</Badge>
            <h2 className="text-xl font-bold text-foreground">
              {type === '3d' ? 'Three.js Powered' : 'Responsive & Modern'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {type === '3d'
                ? 'WebGL experiences that captivate visitors'
                : 'Pixel-perfect layouts built for conversion'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Templates grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-4"
      >
        {templates.map((tpl, i) => {
          const catColor =
            tpl.category === 'professional'
              ? 'from-blue-900/30 to-indigo-900/20'
              : tpl.category === 'digital-products'
              ? 'from-purple-900/30 to-pink-900/20'
              : 'from-emerald-900/30 to-teal-900/20'

          return (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3 }}
              className="rounded-xl border border-border bg-card overflow-hidden group"
            >
              <div className={`aspect-[16/9] bg-gradient-to-br ${catColor} flex items-center justify-center`}>
                <span className="text-2xl">{type === '3d' ? '🌐' : '🖥️'}</span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-sm text-foreground">{tpl.title}</h3>
                <p className="text-xs text-muted-foreground">{tpl.desc}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-bold text-primary">
                    {tpl.price === 0 ? 'Free' : `$${tpl.price}`}
                  </span>
                  <Button size="sm" className="h-7 text-xs px-3">
                    {tpl.price === 0 ? 'Get Free' : 'Buy'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="text-center pt-4">
        <LinkButton href="/marketplace" variant="ghost" className="gap-2 text-primary">
          <ShoppingBag className="w-4 h-4" />
          View All in Marketplace <ArrowRight className="w-3.5 h-3.5" />
        </LinkButton>
      </div>
    </div>
  )
}

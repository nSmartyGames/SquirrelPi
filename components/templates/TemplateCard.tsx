'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Eye } from 'lucide-react'
import type { Template } from '@/types'
import { formatPrice } from '@/lib/utils'

interface TemplateCardProps {
  template: Template
  owned?: boolean
  onBuy?: (template: Template) => void
  onPreview?: (template: Template) => void
}

export default function TemplateCard({ template, owned, onBuy, onPreview }: TemplateCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative rounded-2xl border border-border overflow-hidden aspect-[4/5] flex flex-col justify-end"
    >
      {/* Background — full-bleed website screenshot */}
      {template.preview_image ? (
        <Image
          src={template.preview_image}
          alt={template.title}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-muted-foreground/30 text-sm">No preview</div>
        </div>
      )}

      {/* Permanent bottom gradient so headline stays readable, deepens on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent transition-opacity group-hover:from-black/95" />

      {/* Top badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider backdrop-blur-sm bg-black/40 text-white border-white/10">
            {template.type === '3d' ? '3D' : '2D'}
          </Badge>
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider capitalize backdrop-blur-sm bg-black/40 text-white border-white/10">
            {template.category.replace('-', ' ')}
          </Badge>
        </div>
        {owned && <Badge className="bg-primary text-primary-foreground text-[10px]">Owned</Badge>}
      </div>

      {/* Headline + actions, pinned over the image */}
      <div className="relative z-10 p-4 flex flex-col gap-3">
        <div>
          <h3 className="font-bold text-white text-lg leading-tight tracking-tight drop-shadow-sm">{template.title}</h3>
          {template.description && (
            <p className="text-xs text-white/70 mt-1 line-clamp-2">{template.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            {template.price === 0 ? 'Free' : formatPrice(template.price)}
          </span>
          <div className="flex gap-2">
            {onPreview && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => onPreview(template)}
              >
                <Eye className="w-3.5 h-3.5" />
              </Button>
            )}
            {!owned && onBuy && (
              <Button size="sm" className="h-8 px-3 text-xs" onClick={() => onBuy(template)}>
                {template.price === 0 ? 'Get Free' : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                    Buy
                  </>
                )}
              </Button>
            )}
            {owned && (
              <Button size="sm" className="h-8 px-3 text-xs" variant="secondary">
                Use Template
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

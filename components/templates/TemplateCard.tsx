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
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="group rounded-xl border border-border bg-card overflow-hidden flex flex-col"
    >
      {/* Preview */}
      <div className="relative aspect-[16/10] bg-muted overflow-hidden">
        {template.preview_image ? (
          <Image
            src={template.preview_image}
            alt={template.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-muted-foreground/30 text-sm">No preview</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
            {template.type === '3d' ? '3D' : '2D'}
          </Badge>
          <Badge
            variant="secondary"
            className="text-[10px] uppercase tracking-wider capitalize"
          >
            {template.category.replace('-', ' ')}
          </Badge>
        </div>
        {owned && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-primary-foreground text-[10px]">Owned</Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        <div>
          <h3 className="font-semibold text-foreground text-sm leading-snug">{template.title}</h3>
          {template.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-primary">
            {template.price === 0 ? 'Free' : formatPrice(template.price)}
          </span>
          <div className="flex gap-2">
            {onPreview && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                onClick={() => onPreview(template)}
              >
                <Eye className="w-3.5 h-3.5" />
              </Button>
            )}
            {!owned && onBuy && (
              <Button
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => onBuy(template)}
              >
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

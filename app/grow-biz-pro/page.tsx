import type { Metadata } from 'next'
import GrowBizProLanding from '@/components/marketing/GrowBizProLanding'

export const metadata: Metadata = {
  title: 'Grow Biz Pro — Site profesional pentru afacerea ta',
  description: 'Site profesional, gata rapid, optimizat pentru mobil. De la $9.25/lună.',
}

export default function GrowBizProPage() {
  return <GrowBizProLanding />
}

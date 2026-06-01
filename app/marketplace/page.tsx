import { Suspense } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import MarketplaceContent from '@/components/templates/MarketplaceContent'

export default function MarketplacePage() {
  return (
    <>
      <PageHeader
        title="Marketplace"
        subtitle="Premium website templates — buy once, use forever"
      />
      <Suspense>
        <MarketplaceContent />
      </Suspense>
    </>
  )
}

import PageHeader from '@/components/layout/PageHeader'
import CampaignsContent from '@/components/campaigns/CampaignsContent'

export default function CampaignsPage() {
  return (
    <>
      <PageHeader
        title="Campaigns"
        subtitle="Post to Insta/Meta — generate branded Instagram cards for your weekly content calendar"
      />
      <CampaignsContent />
    </>
  )
}

import PageHeader from '@/components/layout/PageHeader'
import GoLiveContent from '@/components/dashboard/GoLiveContent'

export default function GoLivePage() {
  return (
    <>
      <PageHeader
        title="Go Live"
        subtitle="Deploy your website to the world in one click"
      />
      <GoLiveContent />
    </>
  )
}

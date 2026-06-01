import { auth } from '@clerk/nextjs/server'
import PageHeader from '@/components/layout/PageHeader'
import GoLiveContent from '@/components/dashboard/GoLiveContent'
import { getWebsitesByUser } from '@/lib/airtable/websites'

export default async function GoLivePage() {
  const { userId } = await auth()
  const websites = userId ? await getWebsitesByUser(userId).catch(() => []) : []
  const siteUrl = websites[0]?.domain ?? undefined

  return (
    <>
      <PageHeader
        title="Go Live"
        subtitle="Deploy your website to the world in one click"
      />
      <GoLiveContent siteUrl={siteUrl} />
    </>
  )
}

import PageHeader from '@/components/layout/PageHeader'
import TemplatesByType from '@/components/templates/TemplatesByType'

export default function Templates2DPage() {
  return (
    <>
      <PageHeader
        title="2D Templates"
        subtitle="Clean, responsive website templates"
      />
      <TemplatesByType type="2d" />
    </>
  )
}

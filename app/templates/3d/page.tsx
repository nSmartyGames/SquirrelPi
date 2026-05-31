import PageHeader from '@/components/layout/PageHeader'
import TemplatesByType from '@/components/templates/TemplatesByType'

export default function Templates3DPage() {
  return (
    <>
      <PageHeader
        title="3D Templates"
        subtitle="Immersive Three.js website experiences"
      />
      <TemplatesByType type="3d" />
    </>
  )
}

import Sidebar from '@/components/layout/Sidebar'
import MainWrapper from '@/components/layout/MainWrapper'

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <MainWrapper className="flex-1 h-full overflow-hidden bg-background">
        {children}
      </MainWrapper>
    </div>
  )
}

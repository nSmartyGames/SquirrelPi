import Sidebar from './Sidebar'
import MainWrapper from './MainWrapper'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <MainWrapper className="flex-1 overflow-y-auto bg-background">
        {children}
      </MainWrapper>
    </div>
  )
}

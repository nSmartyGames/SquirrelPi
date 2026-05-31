import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background" style={{ marginLeft: 'max(20%, 200px)' }}>
        {children}
      </main>
    </div>
  )
}

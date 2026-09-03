'use client'

import { useSidebar } from './SidebarContext'

interface Props {
  children: React.ReactNode
  className?: string
}

export default function MainWrapper({ children, className }: Props) {
  const { collapsed } = useSidebar()
  return (
    <main
      className={className}
      style={{
        marginLeft: collapsed ? '44px' : 'clamp(200px, 20%, 260px)',
        transition: 'margin-left 200ms ease',
      }}
    >
      {children}
    </main>
  )
}

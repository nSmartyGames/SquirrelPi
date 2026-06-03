import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { SidebarProvider } from '@/components/layout/SidebarContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'Squirrel Pi — AI Website Builder & Template Marketplace',
  description:
    'Build stunning 2D and 3D websites with AI. Browse premium templates, publish in one click, and manage your domains.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full dark">
        <body className="min-h-full bg-background text-foreground antialiased">
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

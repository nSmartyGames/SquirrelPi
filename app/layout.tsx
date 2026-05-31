import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

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
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full dark`}
      >
        <body className="min-h-full bg-background text-foreground antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}

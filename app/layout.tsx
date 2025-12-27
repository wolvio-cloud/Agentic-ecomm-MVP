import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SnapSell - Sell in 30 Seconds',
  description: 'Camera-first mobile marketplace. Photo → Price → Live → WhatsApp',
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  themeColor: '#FAFAF9',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SnapSell',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  )
}

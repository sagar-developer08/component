import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QLIQ - Marketplace',
  description: 'Your one-stop marketplace for everything',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

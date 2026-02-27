import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI-Forge — Back the AI Tools You Need Built',
  description: 'The AI tools you wish existed — get built by the community. Vote for ideas, submit new concepts, and watch your most-wanted AI tools come to life.',
  openGraph: {
    title: 'AI-Forge — Back the AI Tools You Need Built',
    description: 'Vote for AI tool ideas. The community decides what gets built.',
    type: 'website',
  },
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

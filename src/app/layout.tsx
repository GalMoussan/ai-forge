import type { Metadata } from 'next'
import PlausibleProvider from 'next-plausible'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ai-forge.app'
  ),
  title: 'AI-Forge — Back the AI Tools You Need Built',
  description: 'The AI tools you wish existed — get built by the community. Vote for ideas, submit new concepts, and watch your most-wanted AI tools come to life.',
  openGraph: {
    title: 'AI-Forge — Back the AI Tools You Need Built',
    description: 'Vote for AI tool ideas. The community decides what gets built.',
    type: 'website',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'AI-Forge — Back the AI Tools You Need Built',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Forge — Back the AI Tools You Need Built',
    description: 'Vote for AI tool ideas. The community decides what gets built.',
    images: ['/api/og'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? 'ai-forge.app'
  return (
    <html lang="en">
      <head>
        <PlausibleProvider domain={domain} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  )
}

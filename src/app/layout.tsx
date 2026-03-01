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
  keywords: ['AI tools', 'crowdfunding', 'AI ideas', 'community voting', 'AI forge'],
  authors: [{ name: 'AI-Forge Community' }],
  creator: 'AI-Forge',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? 'ai-forge.app'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ai-forge.app'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AI-Forge',
    url: siteUrl,
    description:
      'The AI tools you wish existed — get built by the community. Vote for ideas, submit new concepts, and watch your most-wanted AI tools come to life.',
  }

  return (
    <html lang="en">
      <head>
        <PlausibleProvider domain={domain} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

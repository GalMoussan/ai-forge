import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#FAFAF8',
          fontFamily: 'system-ui, sans-serif',
          padding: '80px',
          gap: '0px',
        }}
      >
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: '#6366F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '18px',
            }}
          >
            <span style={{ color: 'white', fontSize: '28px', fontWeight: '700' }}>A</span>
          </div>
          <span style={{ fontSize: '36px', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-0.02em' }}>
            AI-Forge
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '60px',
            fontWeight: '700',
            color: '#0A0A0A',
            textAlign: 'center',
            lineHeight: '1.05',
            letterSpacing: '-0.03em',
            marginBottom: '28px',
            maxWidth: '880px',
            display: 'flex',
          }}
        >
          Back the AI tools you need built.
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: '24px',
            color: '#6B7280',
            textAlign: 'center',
            maxWidth: '640px',
            lineHeight: '1.5',
            display: 'flex',
          }}
        >
          Vote on AI tool ideas. The community decides what gets built.
        </div>

        {/* CTA pill */}
        <div
          style={{
            marginTop: '52px',
            display: 'flex',
            alignItems: 'center',
            background: '#6366F1',
            color: 'white',
            padding: '18px 36px',
            borderRadius: '14px',
            fontSize: '20px',
            fontWeight: '600',
            gap: '8px',
          }}
        >
          Add your voice →
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

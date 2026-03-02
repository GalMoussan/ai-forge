import { NextResponse, type NextRequest } from 'next/server'

// Auth session refresh is handled client-side by the Supabase browser client.
// Importing @supabase/ssr here pulls in ws → net/tls which crash Vercel Edge Runtime.
export function middleware(request: NextRequest) {
  return NextResponse.next({ request })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}

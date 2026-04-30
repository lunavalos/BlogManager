import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// In-memory rate limiter (use Redis in production for distributed environments)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX = 1000 // Increased for admin panel navigation

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown'
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  if (entry.count >= RATE_LIMIT_MAX) return true

  entry.count++
  return false
}

export function proxy(request: NextRequest) {
  const response = NextResponse.next()

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload',
  )
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; frame-ancestors 'none'; connect-src 'self';"
  )

  // Rate limiting for API and admin routes
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/admin/')
  ) {
    const key = getRateLimitKey(request)
    if (isRateLimited(key)) {
      return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '900',
        },
      })
    }
  }

  // Cache-Control for public GET requests
  if (
    request.nextUrl.pathname.startsWith('/api/') &&
    request.method === 'GET'
  ) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=30',
    )
  }

  return response
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
}

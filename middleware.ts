import { authMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:3000']

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
export default authMiddleware({
  beforeAuth: async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      const origin = req.headers.get('origin') ?? ''
      
      if (allowedOrigins.includes(origin)) {
        return new NextResponse(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
          },
        })
      }
    }

    // Set CORS headers for API routes
    const origin = req.headers.get('origin') ?? ''
    if (req.nextUrl.pathname.startsWith('/api') && allowedOrigins.includes(origin)) {
      const response = NextResponse.next()
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      return response
    }

    return NextResponse.next()
  },
  afterAuth: async (auth, req) => {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url)
      signInUrl.searchParams.set('redirect_url', req.url)
      return NextResponse.redirect(signInUrl)
    }

    // If the user is signed in and trying to access a protected route, allow them to access route
    if (auth.userId && !auth.isPublicRoute) {
      return NextResponse.next()
    }

    // Allow users visiting public routes to access them
    return NextResponse.next()
  },
  publicRoutes: ['/sign-in(.*)', '/sign-up(.*)', '/']
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}

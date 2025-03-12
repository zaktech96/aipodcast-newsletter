import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import appConfig from '@/config'

// Only use Clerk middleware if auth is enabled
const middleware = appConfig?.auth?.enabled 
  ? clerkMiddleware() 
  : (req: NextRequest) => new Response(null)

export default middleware

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
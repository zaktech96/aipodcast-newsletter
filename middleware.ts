import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import appConfig from './config';

// Define middleware without using Clerk's modules at import time
export default async function middleware(req: NextRequest) {
  // Skip middleware if auth is disabled
  if (!appConfig.auth.enabled) {
    return NextResponse.next();
  }

  try {
    // Dynamically import Clerk's middleware to avoid headers issues
    const { auth } = await import('@clerk/nextjs/server');
    
    // Check if the route is a dashboard route (same as original logic)
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      const { userId } = auth();
      
      // Same auth check as original
      if (!userId) {
        // Use redirectToSignIn from auth directly
        return auth().redirectToSignIn({
          returnBackUrl: req.url
        });
      }
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Clerk middleware error:', error);
    return NextResponse.next();
  }
}

// Use the exact same matcher configuration as the original
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

import { NextResponse } from 'next/server';
import config from './config';
import { createServerActionClient } from '@/lib/supabase';

let clerkMiddleware: (arg0: (auth: any, req: any) => any) => { (arg0: any): any; new (): any },
  createRouteMatcher;

if (config.auth.enabled) {
  try {
    ({ clerkMiddleware, createRouteMatcher } = require('@clerk/nextjs/server'));
  } catch (error) {
    console.warn('Clerk modules not available. Auth will be disabled.');
    config.auth.enabled = false;
  }
}

const isProtectedRoute = config.auth.enabled ? createRouteMatcher(['/dashboard(.*)']) : () => false;
const isOnboardingRoute = config.auth.enabled ? createRouteMatcher(['/onboarding']) : () => false;

export default function middleware(req: any) {
  if (config.auth.enabled) {
    return clerkMiddleware(async (auth, req) => {
      const userId = auth().userId;
      const path = req.nextUrl.pathname;
      
      // If user is not authenticated and tries to access protected routes
      if (!userId && (isProtectedRoute(req) || isOnboardingRoute(req))) {
        return auth().redirectToSignIn();
      }
      
      // User is authenticated
      if (userId) {
        // Check if user is trying to access the sign-in or sign-up pages
        if (path.startsWith('/sign-in') || path.startsWith('/sign-up')) {
          // We'll use a redirect to dashboard first, then let dashboard layout handle onboarding check
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
        
        // For dashboard access, we need to check if user has completed onboarding
        if (path.startsWith('/dashboard')) {
          // We'll rely on a client-side check in the Dashboard component
          // The Dashboard component should check if the user has completed onboarding
          // and redirect to /onboarding if needed
          
          // Important: We need to make sure the Dashboard component implements this check
          // by calling the /api/user/check-onboarding endpoint
        }
        
        // If user is authenticated, they can access onboarding directly
        if (path.startsWith('/onboarding')) {
          return NextResponse.next();
        }
        
        // If user is going to home page and is authenticated, redirect them to dashboard
        if (path === '/') {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      }
      
      return NextResponse.next();
    })(req);
  } else {
    return NextResponse.next();
  }
}

export const middlewareConfig = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

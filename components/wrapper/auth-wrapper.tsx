'use client';

import { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import config from '@/config';
import { dark } from '@clerk/themes';

interface AuthWrapperProps {
  children: ReactNode;
}

// This is a client component that wraps the ClerkProvider
// No need for headers() here as it's not a server component accessing Clerk APIs directly
const AuthWrapper = ({ children }: AuthWrapperProps) => {
  if (!config.auth.enabled) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#10b981'
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
};

export default AuthWrapper;

import NotAuthorized from '@/components/not-authorized';
import { isAuthorized } from '@/utils/data/user/isAuthorized';
import { currentUser } from '@clerk/nextjs/server';
import { ReactNode } from 'react';
import DashboardTopNav from './_components/dashbord-top-nav';
import { headers } from 'next/headers';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Force headers to be evaluated first to avoid headers() errors
  await headers();
  
  // Then get the current user
  const user = await currentUser();

  const { authorized, message } = await isAuthorized(user?.id!);

  // if (!authorized) {
  //   return <NotAuthorized />
  // }

  return (
    <div className="min-h-screen w-full bg-background">
      <DashboardTopNav>
        <main className="mx-auto max-w-7xl w-full p-4 sm:p-6 lg:p-8">{children}</main>
      </DashboardTopNav>
    </div>
  );
}

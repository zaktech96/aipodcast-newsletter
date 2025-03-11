'use client';
import config from '@/config';
import { SignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { dark } from '@clerk/themes';

export default function SignInPage() {
  const router = useRouter();

  if (!config?.auth?.enabled) {
    router.back();
  }

  return (
    <div className="flex min-w-screen justify-center my-[5rem]">
      <SignIn appearance={{ baseTheme: dark }} />
    </div>
  );
}

import { SignUp, useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function SignUpPage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-3xl font-bold mb-6">Create your Titan account</h1>
      <div className="w-full max-w-md rounded-lg shadow-lg p-6 bg-white dark:bg-zinc-900">
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
        <Link
          href={isSignedIn ? '/dashboard' : '/sign-in'}
          className="inline-flex items-center justify-center px-10 py-5 text-2xl font-semibold rounded-xl border border-black/30 shadow-md bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 transition-all duration-200 mt-6"
        >
          Start Summarizing
          <ArrowRight className="ml-3 h-6 w-6" />
        </Link>
      </div>
    </div>
  );
} 
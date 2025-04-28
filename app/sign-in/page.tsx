import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-3xl font-bold mb-6">Sign in to Titan</h1>
      <div className="w-full max-w-md rounded-lg shadow-lg p-6 bg-white dark:bg-zinc-900">
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
      </div>
    </div>
  );
} 
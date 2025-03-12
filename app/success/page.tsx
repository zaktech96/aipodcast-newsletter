import { Button } from '@/components/ui/button';
import NavBar from '@/components/wrapper/navbar';
import Link from 'next/link';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface PageProps {
  params: Params;
  searchParams: SearchParams;
}

export default async function SuccessPage({ params, searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const session = await stripe.checkout.sessions.retrieve(resolvedParams?.session_id as string);

  return (
    <main className="flex min-w-screen flex-col items-center justify-between">
      <h1 className="mt-[35vh] mb-3 scroll-m-20  text-5xl font-semibold tracking-tight transition-colors first:mt-0">
        Welcome to Titan 🎉
      </h1>
      <p className="leading-7 text-center w-[60%]">Let&apos;s get cooking</p>
      <Link href="/dashboard" className="mt-4">
        <Button>Access Dashboard</Button>
      </Link>
    </main>
  );
}

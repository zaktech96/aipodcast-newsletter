'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';
import { TITLE_TAILWIND_CLASS } from '@/utils/constants';
import { useRouter } from 'next/navigation';
import config from '@/config';
import { motion, useInView } from 'framer-motion';

type PricingSwitchProps = {
  isYearly: boolean;
  togglePricingPeriod: (value: string) => void;
};

type PricingCardProps = {
  title: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  description: string;
  features: string[];
  priceId?: string;
  btnText?: string;
  popular?: boolean;
  exclusive?: boolean;
  isYearly?: boolean;
  user: any;
  handleCheckout: (priceId: string) => Promise<void>;
  tier?: number;
};

const PricingHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <section className="text-center">
    <h1
      className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold tracking-tight dark:text-white text-gray-900`}
    >
      {title}
    </h1>
    <p className="text-gray-600 dark:text-gray-400 pt-1">{subtitle}</p>
    <br />
  </section>
);

const PricingSwitch = ({ isYearly, togglePricingPeriod }: PricingSwitchProps) => {
  return (
    <div className="mx-auto flex max-w-xs items-center justify-center space-x-4 mb-8">
      <span 
        className={`text-sm cursor-pointer ${!isYearly ? 'font-semibold text-white' : 'text-gray-400'}`}
        onClick={() => togglePricingPeriod("0")}
      >
        Monthly
      </span>
      <div 
        className="w-14 h-7 bg-gray-900 border border-gray-800 rounded-full p-1 cursor-pointer flex"
        onClick={() => togglePricingPeriod(isYearly ? "0" : "1")}
      >
        <div 
          className={`w-5 h-5 rounded-full transition-all duration-300 ${
            isYearly 
              ? 'bg-green-500 ml-6' 
              : 'bg-white ml-0'
          }`}
        />
      </div>
      <span 
        className={`text-sm cursor-pointer ${isYearly ? 'font-semibold text-white' : 'text-gray-400'}`}
        onClick={() => togglePricingPeriod("1")}
      >
        Yearly
      </span>
    </div>
  );
};

const PricingCard = ({
  title,
  monthlyPrice,
  yearlyPrice,
  description,
  features,
  priceId,
  btnText = 'Get started',
  popular,
  exclusive,
  isYearly,
  user,
  handleCheckout,
  tier = 0,
}: PricingCardProps) => {
  const router = useRouter();
  return (
    <motion.div
      className={cn('flex flex-col justify-between h-full', {
        'lg:scale-105 z-10': popular,
      })}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: tier * 0.1 }}
    >
      <Card
        className={cn('h-full flex flex-col', {
          'border border-green-500/30 shadow-lg shadow-green-500/10': popular,
          'bg-black/30 border-gray-800 hover:border-green-500/20 transition-all duration-200': !popular,
          'bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/30': popular,
        })}
      >
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl font-semibold text-white mb-1">{title}</CardTitle>
          <div className="flex items-baseline gap-1 mt-6 mb-3">
            <span className="text-6xl font-bold text-white">
              ${yearlyPrice && isYearly ? yearlyPrice : monthlyPrice}
            </span>
            <span className="text-base font-normal text-gray-400 ml-1">
              {yearlyPrice && isYearly ? '/year' : '/month'}
            </span>
          </div>
          <CardDescription className="text-gray-400 text-base min-h-[60px]">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 py-8 flex-grow">
          {features.map((feature) => (
            <CheckItem key={feature} text={feature} />
          ))}
        </CardContent>
        <CardFooter className="pt-4 pb-8">
          <Button
            onClick={() => {
              priceId
                ? handleCheckout(priceId)
                : router.push(
                    `${config.auth.enabled && !user ? '/sign-up?redirectUrl=' : ''}/contact`
                  );
            }}
            className={cn('w-full py-6 text-base font-medium', {
              'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-emerald-600 text-white': popular,
              'bg-black/60 text-white hover:bg-gray-900 border border-gray-800 hover:border-green-500/20': !popular,
            })}
          >
            {btnText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const CheckItem = ({ text }: { text: string }) => (
  <div className="flex gap-3 items-start">
    <CheckCircle2 size={18} className="mt-0.5 text-green-400 shrink-0" />
    <p className="text-white text-base">{text}</p>
  </div>
);

export default function Pricing() {
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const togglePricingPeriod = (value: string) => setIsYearly(parseInt(value) === 1);
  
  // Only use the Clerk hook if auth is enabled
  const clerkUser = config.auth.enabled ? useUser() : { user: null, isLoaded: true, isSignedIn: false };
  const { user } = clerkUser;
  const router = useRouter();
  
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  useEffect(() => {
    // Only load Stripe if payments are enabled
    if (config.payments.enabled) {
      setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!));
    }
  }, []);

  const handleCheckout = async (priceId: string) => {
    if (!config.payments.enabled) {
      toast.error('Payments are not configured');
      return;
    }

    if (!user && config.auth.enabled) {
      toast('Please sign in to continue', {
        description: 'You need to be signed in to make a purchase',
        action: {
          label: 'Sign In',
          onClick: () => {
            router.push('/sign-in');
          },
        },
      });
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.emailAddresses?.[0]?.emailAddress,
          priceId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast.error('Failed to checkout', {
        description: error.message,
      });
    }
  };

  // Define the pricing plans
  const plans = [
    {
      title: 'Hobby',
      description: 'Perfect for personal projects and learning.',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: ['1 Project', 'Basic Support', '500MB Storage', 'Community Access'],
      btnText: 'Get Started',
      popular: false,
      tier: 0,
    },
    {
      title: 'Pro',
      description: 'For professional developers and small teams.',
      monthlyPrice: 19,
      yearlyPrice: 190,
      priceId: 'price_pro', // Replace with actual Stripe price ID
      features: [
        'Unlimited Projects',
        'Priority Support',
        '10GB Storage',
        'API Access',
        'Team Collaboration',
      ],
      btnText: 'Get Pro',
      popular: true,
      tier: 1,
    },
    {
      title: 'Enterprise',
      description: 'For large teams with advanced needs.',
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        'Custom Solutions',
        'Dedicated Support',
        'Unlimited Storage',
        'Advanced Security',
        'Custom Integrations',
      ],
      btnText: 'Contact Us',
      popular: false,
      tier: 2,
    },
  ];

  return (
    <div ref={ref} className="w-full py-20 bg-black">
      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Start building with Titan for free, or upgrade to unlock all features. Our pricing is designed to scale with your business.
          </motion.p>
          
          <PricingSwitch isYearly={isYearly} togglePricingPeriod={togglePricingPeriod} />
          
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full max-w-6xl mx-auto">
            {plans.map((plan) => (
              <PricingCard
                key={plan.title}
                title={plan.title}
                description={plan.description}
                monthlyPrice={plan.monthlyPrice}
                yearlyPrice={plan.yearlyPrice}
                features={plan.features}
                priceId={plan.priceId}
                btnText={plan.btnText}
                popular={plan.popular}
                isYearly={isYearly}
                user={user}
                handleCheckout={handleCheckout}
                tier={plan.tier}
              />
            ))}
          </section>
        </div>
      </motion.div>
    </div>
  );
}

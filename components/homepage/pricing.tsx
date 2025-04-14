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
import { CheckCircle2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TITLE_TAILWIND_CLASS } from '@/utils/constants';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Starter',
    price: 49,
    description: 'Perfect for podcasters just getting started',
    features: [
      'Up to 4 episodes per month',
      'Basic AI summarization with 95% accuracy',
      'Beautiful email newsletter templates',
      'Episode performance analytics',
      'Fast & friendly community support',
    ],
  },
  {
    name: 'Professional',
    price: 99,
    description: 'For growing podcasts with a dedicated audience',
    features: [
      'Up to 12 episodes per month',
      'Advanced AI insights & key moments',
      'Custom branded newsletters',
      'Detailed audience engagement metrics',
      'Priority email & chat support',
      'Multi-platform social sharing',
      'Custom topic focus & highlights',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 199,
    description: 'For established podcasts and networks',
    features: [
      'Unlimited episodes',
      'Custom AI training & optimization',
      'White-label newsletter system',
      'Advanced analytics & reporting',
      '24/7 dedicated account manager',
      'Full API access & webhooks',
      'Custom integrations & exports',
      'Revenue sharing opportunities',
    ],
  },
];

const CheckItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3">
    <CheckCircle2 size={20} className="shrink-0 text-emerald-500 dark:text-emerald-400" />
    <p className="text-gray-600 dark:text-gray-300 text-sm">{text}</p>
  </div>
);

export default function Pricing() {
  const [isYearly, setIsYearly] = useState<boolean>(false);
  
  return (
    <div className="container px-4 md:px-6">
      <div className="text-center mb-12">
        <h2 className={TITLE_TAILWIND_CLASS}>Simple, Transparent Pricing</h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Choose the plan that best fits your podcast needs. Save up to 20% with annual billing.
        </p>
      </div>

      <div className="mx-auto flex items-center justify-center space-x-4 mb-8">
        <span 
          className={cn("text-sm cursor-pointer", 
            !isYearly ? "text-gray-900 dark:text-white font-semibold" : "text-gray-500 dark:text-gray-400"
          )}
          onClick={() => setIsYearly(false)}
        >
          Monthly
        </span>
        
        <div 
          className="relative h-7 w-14 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer" 
          onClick={() => setIsYearly(!isYearly)}
        >
          <div 
            className={cn(
              "absolute top-1 h-5 w-5 rounded-full bg-emerald-500 transition-all duration-300",
              isYearly ? "left-8" : "left-1"
            )}
          />
        </div>
        
        <span 
          className={cn("text-sm cursor-pointer", 
            isYearly ? "text-gray-900 dark:text-white font-semibold" : "text-gray-500 dark:text-gray-400"
          )}
          onClick={() => setIsYearly(true)}
        >
          Yearly
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            className={cn("flex flex-col justify-between w-full", {
              "lg:scale-105 z-10": plan.popular,
            })}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card
              className={cn("h-full border-2", {
                "border-emerald-500 dark:border-emerald-400 shadow-lg": plan.popular,
                "hover:border-emerald-500/50 dark:hover:border-emerald-400/50 transition-colors": !plan.popular,
              })}
            >
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  {plan.name}
                  {plan.popular && (
                    <span className="ml-2 inline-block px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                      Most Popular
                    </span>
                  )}
                </CardTitle>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    ${isYearly ? plan.price * 10 : plan.price}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {isYearly ? '/year' : '/month'}
                  </span>
                </div>
                <CardDescription className="pt-3 h-12 text-gray-500 dark:text-gray-400">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {plan.features.map((feature) => (
                  <CheckItem key={feature} text={feature} />
                ))}
              </CardContent>
              <CardFooter className="pt-6">
                <Button
                  className={cn("w-full py-6 text-base font-medium", {
                    "bg-emerald-500 hover:bg-emerald-600 text-white": plan.popular,
                    "border-2 hover:border-emerald-500 hover:text-emerald-500": !plan.popular,
                  })}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.popular ? "Get Started Now" : "Get Started"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          All plans include 14-day free trial. No credit card required.
          <br />
          Need a custom plan? <span className="text-emerald-500 hover:text-emerald-600 cursor-pointer">Contact us</span>
        </p>
      </div>
    </div>
  );
}

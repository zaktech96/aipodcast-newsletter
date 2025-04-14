'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { FC } from 'react';

interface CTAProps {}

const CTA: FC<CTAProps> = () => {
  return (
    <div className="container px-4 md:px-6">
      <motion.div 
        className="relative overflow-hidden rounded-3xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-10" />
        <div className="relative grid gap-6 lg:grid-cols-2 lg:gap-12 p-8 md:p-12 lg:p-16 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Transform Your Podcast Content?
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Join thousands of podcast creators who are saving time and growing their audience with AI-powered summaries.
            </p>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Schedule a Demo
              </Button>
            </div>
          </div>
          <div className="grid gap-4 text-center lg:text-left">
            <div className="grid gap-1">
              <div className="font-semibold text-xl">Free Trial Available</div>
              <p className="text-sm text-muted-foreground">
                Try our service with 2 free episode summaries
              </p>
            </div>
            <div className="grid gap-1">
              <div className="font-semibold text-xl">No Credit Card Required</div>
              <p className="text-sm text-muted-foreground">
                Start your trial without any commitment
              </p>
            </div>
            <div className="grid gap-1">
              <div className="font-semibold text-xl">Cancel Anytime</div>
              <p className="text-sm text-muted-foreground">
                Flexible monthly plans with no long-term contracts
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default CTA; 
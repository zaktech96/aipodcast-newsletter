'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Headphones, MessageSquareText, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Transform Podcasts into
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Actionable Insights</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground">
            AI-powered summaries that capture the essence of every episode. Save time, never miss key takeaways, and stay informed.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90">
              <Link href="#pricing">Start Summarizing</Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="#benefits">Learn More</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 relative"
        >
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 rounded-full blur-3xl" />
            <div className="relative bg-background rounded-2xl shadow-2xl p-6 border border-border">
              <div className="flex items-center gap-4 mb-6">
                <Headphones className="w-8 h-8 text-purple-600" />
                <h3 className="text-xl font-semibold">Latest Episode Summary</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MessageSquareText className="w-5 h-5 mt-1 text-muted-foreground" />
                  <p className="text-sm">Key insights extracted and organized for quick consumption</p>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 mt-1 text-muted-foreground" />
                  <p className="text-sm">AI-enhanced summaries that capture nuance and context</p>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <div className="h-2 bg-muted rounded-full w-3/4" />
                <div className="h-2 bg-muted rounded-full w-1/2" />
                <div className="h-2 bg-muted rounded-full w-5/6" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

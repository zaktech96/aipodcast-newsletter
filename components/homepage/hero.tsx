'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Headphones, Sparkles, Wand2 } from 'lucide-react';

export default function Hero() {
  return (
    <div className="container px-4 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
        {/* Left Content */}
        <motion.div 
          className="flex flex-col justify-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <motion.div 
              className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Podcast Summaries
            </motion.div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Transform Your Podcasts into
              <span className="text-gradient bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600"> Engaging Content</span>
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Save time and reach more listeners with AI-generated summaries, newsletters, and key insights from your podcast episodes.
            </p>
          </div>
          <div className="flex flex-col gap-3 min-[400px]:flex-row">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Start Summarizing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <Wand2 className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">95% Accuracy</span>
            </div>
            <div className="flex items-center">
              <Headphones className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">5k+ Episodes Processed</span>
            </div>
          </div>
        </motion.div>

        {/* Right Preview */}
        <motion.div 
          className="mx-auto w-full max-w-[400px] lg:max-w-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square">
            <div className="absolute inset-0">
              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50 p-8">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] dark:bg-grid-black/10" />
                <div className="relative h-full w-full overflow-hidden rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Headphones className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Latest Episode Summary</h3>
                      <p className="text-sm text-muted-foreground">Generated in 5 minutes</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="mt-6 pt-6 border-t">
                    <div className="text-sm font-medium mb-2">Key Takeaways</div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-muted rounded animate-pulse" />
                      <div className="h-3 w-4/5 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
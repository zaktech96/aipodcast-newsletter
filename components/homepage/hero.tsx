'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Clock, Share2 } from 'lucide-react';

export default function Hero() {
  const platforms = [
    {
      name: 'Spotify',
      icon: '/platforms/spotify.svg',
    },
    {
      name: 'Apple Podcasts',
      icon: '/platforms/apple-podcasts.svg',
    },
    {
      name: 'YouTube',
      icon: '/platforms/youtube.svg',
    },
    {
      name: 'Google Podcasts',
      icon: '/platforms/google-podcasts.svg',
    },
    {
      name: 'RSS',
      icon: '/platforms/rss.svg',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background" />
      
      <div className="container relative px-4 py-20 mx-auto">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Podcast Summaries
              </motion.div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Transform Your Podcast Into
                <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Engaging Content</span>
              </h1>
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 text-center lg:text-left">
              <div className="p-4 rounded-lg bg-white/50 dark:bg-white/5 backdrop-blur-sm">
                <Clock className="w-6 h-6 mb-2 mx-auto lg:mx-0 text-purple-600" />
                <p className="text-sm font-medium">Save 4+ Hours Per Episode</p>
              </div>
              <div className="p-4 rounded-lg bg-white/50 dark:bg-white/5 backdrop-blur-sm">
                <Share2 className="w-6 h-6 mb-2 mx-auto lg:mx-0 text-purple-600" />
                <p className="text-sm font-medium">Boost Engagement by 3x</p>
              </div>
              <div className="p-4 rounded-lg bg-white/50 dark:bg-white/5 backdrop-blur-sm col-span-2 md:col-span-1">
                <Sparkles className="w-6 h-6 mb-2 mx-auto lg:mx-0 text-purple-600" />
                <p className="text-sm font-medium">95% Accuracy Rate</p>
              </div>
            </div>

            <div className="space-y-4 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-center lg:text-left">Works with all major platforms</h3>
              <div className="flex flex-wrap items-center gap-8 justify-center lg:justify-start">
                {platforms.map((platform) => (
                  <motion.div
                    key={platform.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center lg:items-start gap-2"
                  >
                    <img 
                      src={platform.icon} 
                      alt={platform.name} 
                      className="h-10 w-10 opacity-80 hover:opacity-100 transition-all duration-200"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{platform.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Start Summarizing
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="border-purple-500 text-purple-600 hover:bg-purple-50 hover:text-purple-700">
                View Demo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative lg:ml-8"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-50 dark:from-purple-900/30 dark:to-pink-800/10 p-8">
              <div className="absolute inset-0 bg-grid-pattern opacity-10" />
              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="w-full h-full rounded-xl bg-white/80 dark:bg-white/10 backdrop-blur-sm p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Latest Episode Summary</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Generated in 5 minutes</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 w-3/4 bg-purple-100 dark:bg-purple-900/50 rounded animate-pulse" />
                    <div className="h-4 w-full bg-purple-100 dark:bg-purple-900/50 rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-purple-100 dark:bg-purple-900/50 rounded animate-pulse" />
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="text-sm font-medium mb-2">Key Takeaways</div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-purple-100 dark:bg-purple-900/50 rounded animate-pulse" />
                      <div className="h-3 w-4/5 bg-purple-100 dark:bg-purple-900/50 rounded animate-pulse" />
                      <div className="h-3 w-3/4 bg-purple-100 dark:bg-purple-900/50 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 
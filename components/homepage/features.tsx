'use client';

import { motion } from 'framer-motion';
import { Brain, Clock, Globe, Share2, Sparkles, Target, Headphones, Youtube, Podcast } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms extract key insights and themes from your episodes with 95% accuracy.',
    icon: Brain,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Universal Platform Support',
    description: 'Compatible with all major platforms including Spotify, Apple Podcasts, YouTube, Google Podcasts, and more.',
    icon: Podcast,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Quick Summaries',
    description: 'Get comprehensive episode summaries in under 5 minutes, saving hours of manual work.',
    icon: Clock,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Smart Highlights',
    description: 'Automatically identify and extract key quotes, timestamps, and memorable moments.',
    icon: Sparkles,
    gradient: 'from-orange-500 to-red-500'
  },
  {
    title: 'Multi-Channel Distribution',
    description: 'Share summaries across social media, blogs, newsletters, and YouTube with one click.',
    icon: Share2,
    gradient: 'from-violet-500 to-purple-500'
  },
  {
    title: 'Global Reach',
    description: 'Support for multiple languages helps you reach international audiences effectively.',
    icon: Globe,
    gradient: 'from-teal-500 to-green-500'
  },
  {
    title: 'Video Content Support',
    description: 'Extract insights from video podcasts on YouTube and other platforms automatically.',
    icon: Youtube,
    gradient: 'from-red-500 to-pink-500'
  },
  {
    title: 'Custom Focus Areas',
    description: 'Train the AI to focus on topics and themes that matter most to your audience.',
    icon: Target,
    gradient: 'from-indigo-500 to-blue-500'
  },
] as const;

export default function Features() {
  return (
    <div className="container px-4 md:px-6">
      <div className="text-center space-y-4">
        <motion.h2 
          className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Powerful Features for Podcast Creators
        </motion.h2>
        <motion.p 
          className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Everything you need to transform your podcast content into engaging, shareable summaries
        </motion.p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow duration-200 h-full">
              <div className="p-6">
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center rounded-2xl p-4 bg-gradient-to-br ${feature.gradient} mb-6`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="inline-flex items-center justify-center gap-12 rounded-lg border bg-background px-12 py-6">
          <div className="flex items-center gap-3">
            <Youtube className="h-8 w-8 text-red-500" />
            <span className="text-base font-medium">YouTube</span>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="flex items-center gap-3">
            <Podcast className="h-8 w-8 text-green-500" />
            <span className="text-base font-medium">Spotify</span>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="flex items-center gap-3">
            <Headphones className="h-8 w-8 text-purple-500" />
            <span className="text-base font-medium">Apple Podcasts</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 
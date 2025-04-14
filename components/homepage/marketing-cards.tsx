'use client';

import { motion } from 'framer-motion';
import { Brain, Clock, Newspaper, Share2, Sparkles, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms extract key insights, themes, and takeaways from every episode.',
    icon: Brain,
  },
  {
    title: 'Time-Saving Summaries',
    description: 'Get the essence of hour-long episodes in minutes with concise, well-structured summaries.',
    icon: Clock,
  },
  {
    title: 'Newsletter Integration',
    description: 'Automatically generate engaging newsletters for your podcast subscribers.',
    icon: Newspaper,
  },
  {
    title: 'Smart Highlights',
    description: 'Important quotes, timestamps, and key moments automatically identified and highlighted.',
    icon: Sparkles,
  },
  {
    title: 'Easy Sharing',
    description: 'Share summaries across social media and embed them on your website or blog.',
    icon: Share2,
  },
  {
    title: 'Custom Focus Areas',
    description: 'Train the AI to focus on topics and themes that matter most to your audience.',
    icon: Target,
  },
];

export default function MarketingCards() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">Powerful Features for Podcast Creators</h2>
        <p className="mt-4 text-lg text-muted-foreground">Everything you need to transform your podcast content</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="p-6 h-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
                </div>
  );
}

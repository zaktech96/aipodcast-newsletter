'use client';

import { motion } from 'framer-motion';
import { Brain, Clock, FileText, Globe, MessageSquare, Share2, Sparkles, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms extract key insights and themes from your episodes with 95% accuracy.',
    icon: Brain,
  },
  {
    title: 'Quick Summaries',
    description: 'Get comprehensive episode summaries in under 5 minutes, saving hours of manual work.',
    icon: Clock,
  },
  {
    title: 'Newsletter Integration',
    description: 'Automatically generate engaging newsletters that keep your audience informed and coming back.',
    icon: FileText,
  },
  {
    title: 'Smart Highlights',
    description: 'Automatically identify and extract key quotes, timestamps, and memorable moments.',
    icon: Sparkles,
  },
  {
    title: 'Multi-Platform Sharing',
    description: 'Share your summaries across social media, blogs, and newsletters with one click.',
    icon: Share2,
  },
  {
    title: 'Audience Engagement',
    description: 'Foster discussion with AI-generated conversation starters and key talking points.',
    icon: MessageSquare,
  },
  {
    title: 'Global Reach',
    description: 'Support for multiple languages helps you reach international audiences effectively.',
    icon: Globe,
  },
  {
    title: 'Custom Focus',
    description: 'Train the AI to focus on topics and themes that matter most to your audience.',
    icon: Target,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Features() {
  return (
    <div className="container px-4 md:px-6">
      <div className="text-center">
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
          className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Everything you need to transform your podcast content into engaging, shareable summaries
        </motion.p>
      </div>

      <motion.div 
        className="mx-auto mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {features.map((feature) => (
          <motion.div key={feature.title} variants={itemVariants}>
            <Card className="relative overflow-hidden p-6 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 
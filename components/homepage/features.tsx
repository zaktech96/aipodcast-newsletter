'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Brain, Clock, Share2, BarChart3, Sparkles, Newspaper } from 'lucide-react';

const features = [
  {
    title: "AI-Powered Transcription",
    description: "95% accurate transcription with speaker diarization, handling multiple accents and languages with ease.",
    icon: Brain,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Time-Saving Summaries",
    description: "Reduce 1-hour episodes to 5-minute reads while preserving key insights and memorable quotes.",
    icon: Clock,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Multi-Format Export",
    description: "Generate newsletters, social posts, and blog articles automatically from your podcast content.",
    icon: Share2,
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Engagement Analytics",
    description: "Track content performance with detailed metrics on reader engagement and social sharing.",
    icon: BarChart3,
    color: "from-orange-500 to-red-500"
  },
  {
    title: "Smart Highlights",
    description: "AI identifies key moments, quotable segments, and trending topics from your episodes.",
    icon: Sparkles,
    color: "from-violet-500 to-purple-500"
  },
  {
    title: "Newsletter Integration",
    description: "Direct integration with popular email platforms for automated content distribution.",
    icon: Newspaper,
    color: "from-yellow-500 to-orange-500"
  }
];

export default function Features() {
  return (
    <div className="container px-4 py-24 mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
        >
          Powerful Features for Podcast Creators
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground"
        >
          Everything you need to transform your podcast content into engaging written material that reaches a wider audience.
        </motion.p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 h-full bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50 backdrop-blur-sm border-2 hover:border-emerald-500/50 transition-all duration-300">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 
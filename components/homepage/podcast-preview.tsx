'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Clock, MessageSquare, Share2, Sparkles } from 'lucide-react';

const samplePodcast = {
  title: "The Future of AI in Business",
  host: "Tech Insights with Sarah Chen",
  duration: "54 minutes",
  summary: `In this thought-provoking episode, we explore how artificial intelligence is reshaping modern business landscapes. Key highlights include:

• The rise of AI-powered customer service solutions and their impact on customer satisfaction
• How predictive analytics are transforming inventory management and supply chains
• Real-world case studies from leading tech companies
• Future predictions for AI integration in small to medium-sized businesses

Expert guest Dr. Michael Roberts shares insights from his 15 years of experience implementing AI solutions across Fortune 500 companies.`,
  keyTakeaways: [
    "AI adoption in customer service can reduce response times by 74%",
    "Predictive analytics can improve inventory accuracy by up to 85%",
    "Small businesses can start with simple AI tools for immediate impact",
    "The importance of ethical AI implementation in business practices"
  ],
  timestamps: [
    { time: "02:15", topic: "Introduction to modern AI in business" },
    { time: "12:30", topic: "Customer service transformation" },
    { time: "25:45", topic: "Predictive analytics deep dive" },
    { time: "38:20", topic: "Case study: TechCorp AI implementation" },
    { time: "45:10", topic: "Future trends and predictions" }
  ],
  engagement: {
    sentiment: "Positive",
    topics: ["AI", "Business", "Technology", "Innovation"],
    readingTime: "3 minutes"
  }
};

export default function PodcastPreview() {
  return (
    <div className="relative overflow-hidden bg-purple-50/50 dark:bg-purple-950/10">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                Transform Your Podcast Into
                <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Engaging Content</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Our AI-powered platform turns your episodes into compelling summaries, key takeaways, and shareable moments.
              </p>
            </div>

            <Card className="p-6 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Save Time</h3>
                    <p className="text-sm text-gray-500">Generate summaries in minutes, not hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Share2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Boost Engagement</h3>
                    <p className="text-sm text-gray-500">Increase listener interaction by 3x</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">High Accuracy</h3>
                    <p className="text-sm text-gray-500">95% accuracy in key point extraction</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <Card className="p-6 bg-white dark:bg-gray-950 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Latest Episode Summary</h3>
                  <p className="text-sm text-gray-500">Generated in 5 minutes</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-3/4 bg-purple-100 dark:bg-purple-900/30 rounded animate-pulse" />
                <div className="h-4 w-full bg-purple-100 dark:bg-purple-900/30 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-purple-100 dark:bg-purple-900/30 rounded animate-pulse" />
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="text-sm font-medium mb-2">Key Takeaways</div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-purple-100 dark:bg-purple-900/30 rounded animate-pulse" />
                  <div className="h-3 w-4/5 bg-purple-100 dark:bg-purple-900/30 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-purple-100 dark:bg-purple-900/30 rounded animate-pulse" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 
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
    <div className="container px-4 md:px-6 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">See It In Action</h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Transform hour-long episodes into engaging, shareable content in minutes
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <Card className="p-6 border-2 border-emerald-500/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{samplePodcast.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{samplePodcast.host}</p>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                {samplePodcast.duration}
              </div>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {samplePodcast.summary}
              </p>
            </div>
          </Card>

          <Card className="p-6 border-2 border-emerald-500/20">
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-emerald-500" />
              Key Takeaways
            </h4>
            <ul className="space-y-2">
              {samplePodcast.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="text-gray-600 dark:text-gray-300 text-sm">
                  • {takeaway}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <Card className="p-6 border-2 border-emerald-500/20">
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-emerald-500" />
              Episode Timeline
            </h4>
            <div className="space-y-2">
              {samplePodcast.timestamps.map((stamp, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-emerald-500 font-mono text-sm mr-3">{stamp.time}</span>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">{stamp.topic}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-2 border-emerald-500/20">
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center">
              <Share2 className="w-5 h-5 mr-2 text-emerald-500" />
              Engagement Insights
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Sentiment</span>
                <span className="text-sm font-medium text-emerald-500">{samplePodcast.engagement.sentiment}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Key Topics</span>
                <div className="flex gap-2">
                  {samplePodcast.engagement.topics.map((topic, index) => (
                    <span key={index} className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Reading Time</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{samplePodcast.engagement.readingTime}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 
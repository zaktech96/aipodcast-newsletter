'use client';

import { motion } from 'framer-motion';
import { Clock, Headphones, MessageSquareText, Share2 } from 'lucide-react';

export default function SideBySide() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold">Transform Your Podcast Content</h2>
          <p className="text-lg text-muted-foreground">
            Stop losing potential listeners to time constraints. Our AI-powered platform turns your episodes into engaging summaries and newsletters that keep your audience growing.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Save Time</h3>
                <p className="text-muted-foreground">Automatically generate summaries in minutes instead of hours of manual work</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquareText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Boost Engagement</h3>
                <p className="text-muted-foreground">Keep your audience informed and engaged with bite-sized content</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Share2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Expand Reach</h3>
                <p className="text-muted-foreground">Share summaries across platforms to attract new listeners</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 rounded-full blur-3xl" />
            <div className="relative bg-background rounded-2xl shadow-2xl p-6 border border-border">
              <div className="flex items-center gap-4 mb-6">
                <Headphones className="w-8 h-8 text-purple-600" />
                <h3 className="text-xl font-semibold">Latest Episode Summary</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded-full w-3/4" />
                  <div className="h-4 bg-muted rounded-full w-5/6" />
                  <div className="h-4 bg-muted rounded-full w-2/3" />
                </div>
                
                <div className="pt-4 border-t border-border">
                  <div className="text-sm font-medium mb-2">Key Takeaways</div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded-full w-full" />
                    <div className="h-3 bg-muted rounded-full w-4/5" />
                    <div className="h-3 bg-muted rounded-full w-3/4" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <div className="text-sm font-medium mb-2">Share</div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded bg-muted" />
                    <div className="h-8 w-8 rounded bg-muted" />
                    <div className="h-8 w-8 rounded bg-muted" />
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

'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Tech Podcast Host',
    content: 'This tool has completely transformed how I engage with my audience. The AI summaries are incredibly accurate and save me hours of work each week.',
    initials: 'SC',
  },
  {
    name: 'Mike Rodriguez',
    role: 'Business Show Host',
    content: 'The newsletter integration is fantastic. My subscribers love getting the key insights from each episode, and it\'s helped grow my listener base significantly.',
    initials: 'MR',
  },
  {
    name: 'Emily Taylor',
    role: 'True Crime Podcaster',
    content: 'Being able to share episode summaries across social media has boosted my engagement rates by 300%. The AI catches details I might have missed.',
    initials: 'ET',
  },
  {
    name: 'David Kim',
    role: 'Educational Podcaster',
    content: 'The multi-language support has helped me reach international audiences I never thought possible. The summaries maintain context perfectly.',
    initials: 'DK',
  },
] as const;

export default function Testimonials() {
  return (
    <div className="container px-4 md:px-6">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
            <Star className="mr-2 h-4 w-4 text-yellow-500" />
            Trusted by 1000+ Podcast Creators
          </div>
        </motion.div>
        <motion.h2 
          className="mt-6 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          What Creators Are Saying
        </motion.h2>
      </div>

      <div className="mx-auto mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
              <div className="mt-4 text-muted-foreground">
                "{testimonial.content}"
              </div>
              <div className="mt-4 flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
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
        <div className="inline-flex items-center justify-center gap-8 rounded-lg border bg-background px-8 py-4">
          <div>
            <div className="text-3xl font-bold">1000+</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <div className="text-3xl font-bold">50K+</div>
            <div className="text-sm text-muted-foreground">Episodes Processed</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <div className="text-3xl font-bold">4.9/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 
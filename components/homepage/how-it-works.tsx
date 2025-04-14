'use client';

import { motion } from 'framer-motion';
import { FileAudio, FileText, MessageSquareText, Send } from 'lucide-react';
import { FC } from 'react';

const steps = [
  {
    title: 'Upload Your Episode',
    description: 'Simply upload your podcast episode or provide an RSS feed link. We support all major podcast formats.',
    icon: FileAudio,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'AI Processing',
    description: 'Our advanced AI analyzes your content, identifying key topics, quotes, and insights with high accuracy.',
    icon: MessageSquareText,
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Generate Summary',
    description: 'Get a well-structured summary with key takeaways, timestamps, and highlights in your preferred format.',
    icon: FileText,
    color: 'from-orange-500 to-red-500',
  },
  {
    title: 'Share & Engage',
    description: 'Distribute your summary across platforms and watch your audience engagement grow.',
    icon: Send,
    color: 'from-green-500 to-emerald-500',
  },
];

const HowItWorks: FC = () => {
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
          How It Works
        </motion.h2>
        <motion.p 
          className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Transform your podcast into engaging content in four simple steps
        </motion.p>
      </div>

      <div className="mx-auto mt-16 max-w-5xl">
        <div className="grid gap-8 md:grid-cols-2">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-xl border bg-background p-6">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${step.color}`}>
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      <span className="text-muted-foreground mr-2">0{index + 1}</span>
                      {step.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <motion.div 
                  className="absolute left-6 top-full h-8 w-px bg-border md:left-1/2 md:h-px md:w-full"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HowItWorks; 
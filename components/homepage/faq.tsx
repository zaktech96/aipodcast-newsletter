'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';

const faqs = [
  {
    question: 'How accurate are the AI-generated summaries?',
    answer: 'Our AI model is trained specifically on podcast content and achieves over 95% accuracy in capturing key points and insights. We continuously improve our algorithms based on user feedback to ensure the highest quality summaries.',
  },
  {
    question: 'How long does it take to get a summary?',
    answer: 'Most episode summaries are generated within 5-10 minutes after uploading. The exact time depends on the episode length and complexity. You\'ll receive a notification when your summary is ready.',
  },
  {
    question: 'Can I customize the summary format?',
    answer: 'Yes! You can customize the summary length, focus areas, and newsletter template to match your brand and audience preferences. Our Professional and Enterprise plans offer additional customization options.',
  },
  {
    question: 'Do you support multiple languages?',
    answer: 'Currently, we support English, Spanish, French, and German. We\'re actively working on adding more languages based on user demand.',
  },
  {
    question: 'How do I integrate the summaries with my existing newsletter?',
    answer: 'We provide easy integration with popular email platforms like Mailchimp, ConvertKit, and Substack. You can also export summaries in various formats (HTML, Markdown, plain text) for manual integration.',
  },
  {
    question: 'What happens if I exceed my monthly episode limit?',
    answer: 'You can purchase additional episodes as needed, or upgrade to a higher tier plan. We\'ll notify you when you\'re approaching your limit so you can plan accordingly.',
  },
  {
    question: 'Can I try before subscribing?',
    answer: 'Yes! We offer a free trial where you can summarize up to 2 episodes to experience the quality and features of our service.',
  },
] as const;

export default function FAQ() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to know about our podcast summarization service
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
}

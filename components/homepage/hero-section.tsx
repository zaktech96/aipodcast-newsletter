'use client';
import Link from 'next/link';
import { Button } from '../ui/button';
import { MacbookScroll } from '../ui/macbook-scroll';
import { TITLE_TAILWIND_CLASS } from '@/utils/constants';
import { ArrowRight, Github, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Cover } from '@/components/ui/cover';

// Electric animation component
const ElectricHighlight = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.span
      className="relative inline-block"
      initial={{ opacity: 1 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
    >
      {children}
      <motion.span
        className="absolute inset-0 z-[-1] bg-gradient-to-r from-green-300 to-emerald-400 rounded-lg opacity-0"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ 
          opacity: [0, 0.2, 0], 
          scale: [0.85, 1.05, 0.85],
          x: [0, 3, 0, -3, 0] 
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          repeatType: "reverse", 
          ease: "easeInOut" 
        }}
      />
    </motion.span>
  );
};

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.section
      className="flex flex-col items-center justify-center w-full mt-16 sm:mt-20 md:mt-24"
      aria-label="Titan Hero"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="relative"
      >
        <motion.h1
          className={`${TITLE_TAILWIND_CLASS} scroll-m-20 font-semibold tracking-tight text-center max-w-[1120px] text-white`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 10 
          }}
        >
          <ElectricHighlight>Build & Ship <Cover>Fast</Cover></ElectricHighlight>
        </motion.h1>
      </motion.div>

      <motion.p 
        className="mx-auto max-w-[700px] text-gray-500 text-center mt-8 dark:text-gray-400"
        variants={itemVariants}
      >
        The Ultimate NextJS Boilerplate for quickly building your Startup - Focus on your Product.
      </motion.p>

      <motion.div 
        className="flex justify-center items-center gap-3 mt-4 relative z-10"
        variants={itemVariants}
      >
        <Button
          asChild
          variant="outline"
          className="flex items-center gap-2 border-green-500 hover:bg-green-500/10 group"
        >
          <Link
            href="https://github.com/ObaidUr-Rahmaan/titan"
            target="_blank"
            aria-label="Start Building (opens in a new tab)"
          >
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Github className="w-5 h-5 group-hover:text-green-500 transition-colors" aria-hidden="true" />
              <span>Start Building</span>
            </motion.div>
          </Link>
        </Button>

        <Button 
          asChild 
          variant="outline" 
          className="flex items-center gap-2 group border-emerald-500 hover:bg-emerald-500/10"
        >
          <Link
            href="https://discord.gg/F6rUxWvKrV"
            target="_blank"
            aria-label="Join Discord (opens in a new tab)"
          >
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span>Join Discord</span>
              <ArrowRight className="w-4 h-4 group-hover:text-emerald-500 transition-colors" aria-hidden="true" />
            </motion.div>
          </Link>
        </Button>
      </motion.div>

      <motion.div 
        className="hidden md:block relative z-0 mt-16"
        variants={itemVariants}
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            delay: 0.8,
            duration: 0.8, 
            ease: [0.19, 1.0, 0.22, 1.0]
          }
        }}
      >
        <motion.div
          whileInView={{ 
            boxShadow: [
              "0 0 0 0 rgba(74, 222, 128, 0)",
              "0 0 30px 5px rgba(74, 222, 128, 0.3)",
              "0 0 0 0 rgba(74, 222, 128, 0)"
            ]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <MacbookScroll
            src={'https://utfs.io/f/69a12ab1-4d57-4913-90f9-38c6aca6c373-1txg2.png'}
            showGradient
          />
        </motion.div>
      </motion.div>
      <div className="hidden md:block h-64" />
      <div className="hidden md:block h-64" />
      <div className="hidden md:block h-32" />
    </motion.section>
  );
}

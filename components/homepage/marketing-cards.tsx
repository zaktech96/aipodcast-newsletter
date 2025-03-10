'use client';
import { TITLE_TAILWIND_CLASS } from '@/utils/constants';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { Sparkles, Zap } from 'lucide-react';

const ProjectsData = [
  {
    id: 1,
    name: 'Nextjs 15',
    description:
      'A framework for React that enables server-side rendering and effortless deployment.',
    image: 'https://utfs.io/f/a8df6965-e6df-417a-ab0b-b3ad33d701d7-hcfblw.png',
    imageDark: 'https://utfs.io/f/c5588304-c7ff-43f9-b164-3b9c78474b73-rv0oux.png',
    url: 'https://nextjs.org/',
  },
  {
    id: 2,
    name: 'Clerk Authentication',
    description: 'Seamless and secure authentication service for web applications.',
    image: 'https://utfs.io/f/aee7360d-54f1-4ed1-a4b4-49a56b455bf4-1ker11.png',
    url: 'https://clerk.com/',
  },
  {
    id: 3,
    name: 'Supabase (PostgreSQL)',
    description:
      'PostgreSQL-based open-source database for building scalable applications.',
    image: 'https://utfs.io/f/c62a5d13-91e4-476f-9d36-786d9995c97f-rqpuxo.png',
    url: 'https://supabase.com/',
  },
  {
    id: 4,
    name: 'Drizzle ORM',
    description:
      'Modern headless TypeScript ORM for database interactions.',
    image: '/logos/drizzle-logo.png',
    url: 'https://orm.drizzle.team/',
  },
  {
    id: 5,
    name: 'Stripe Subsctiptions & One-Time Payments',
    description:
      'Payment processing solution for handling subscriptions and one-off transactions securely.',
    image: 'https://utfs.io/f/a2fbe9db-35f8-4738-a4c4-0b9a29f4efc7-er2coj.png',
    url: 'https://stripe.com',
  },
  {
    id: 6,
    name: 'Tanstack Query',
    description:
      'Powerful data fetching library that handles caching, background updates and stale data out of the box.',
    image: 'https://utfs.io/f/ee162388-f998-4740-bfc4-9d9a7050f485-90gb5l.png',
    url: 'https://tanstack.com/query/v5',
  },
  {
    id: 7,
    name: 'Plunk',
    description:
      'Simple and powerful email service for sending transactional and marketing emails.',
    image: 'https://utfs.io/f/e1JG3uPHb3VpAbyJ8vtmNbFTjE9L3wZGsJtzPhkDR7CrI6yf',
    url: 'https://useplunk.com',
  },
  {
    id: 8,
    name: 'DataFast',
    description: 'User Analytics for Actionable Growth (Know exactly which marketing channels are working).',
    image: '/logos/datafast-logo.png',
    url: 'https://datafa.st',
  },
];

// Electric pulse animation component
const ElectricPulse = () => {
  return (
    <motion.div 
      className="absolute -inset-0.5 rounded-md z-0 bg-gradient-to-r from-green-400/30 to-emerald-500/30 opacity-0 group-hover:opacity-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0 }}
      whileHover={{ 
        opacity: [0, 0.7, 0.4],
        transition: { duration: 0.3 }
      }}
    />
  );
};

// Zap icon animation
const AnimatedZap = () => {
  return (
    <motion.div
      className="absolute top-3 right-3 text-green-400 opacity-0 group-hover:opacity-100"
      initial={{ scale: 0, rotate: -10 }}
      whileHover={{ 
        scale: 1,
        rotate: [0, 15, 0, -10, 0],
        transition: { 
          type: "spring", 
          stiffness: 300, 
          damping: 5,
          duration: 1,
          repeat: Infinity,
          repeatType: "loop"
        } 
      }}
    >
      <Sparkles size={16} />
    </motion.div>
  );
};

const SpringAnimatedFeatures = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  return (
    <motion.div 
      ref={ref}
      className="flex flex-col justify-center items-center w-full py-24 bg-black px-4 sm:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex flex-col mb-[3rem]"
        initial={{ y: 20, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h2
          className="text-4xl md:text-5xl mt-2 font-semibold tracking-tight text-white text-center"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2"
          >
            <span>Built with the best Tech</span>
            <motion.span
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 0.5, 
                repeat: Infinity, 
                repeatDelay: 4,
                ease: "easeInOut" 
              }}
            >
              <Zap className="text-green-500" size={32} />
            </motion.span>
          </motion.div>
        </h2>
        <motion.p 
          className="mx-auto max-w-[600px] text-gray-400 text-center mt-2"
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Your customers deserve your focus - build with tech that just works.
        </motion.p>
      </motion.div>

      <motion.div 
        className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {ProjectsData.map((project, index) => {
          return (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.1 * index,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }
              }}
              key={project.id}
              className="mt-5 text-left border border-gray-800 p-6 rounded-md dark:bg-black/30 bg-gray-900 backdrop-blur-sm relative group"
            >
              <ElectricPulse />
              <AnimatedZap />
              <Link href={project?.url} target="_blank" rel="noopener noreferrer" className="relative z-10 block">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Image
                    src={project?.imageDark ? project?.imageDark : project.image}
                    width={40}
                    height={30}
                    className="mb-3 rounded object-contain"
                    alt={project.name}
                  />
                </motion.div>
                <motion.div 
                  className="mb-1 text-sm font-medium text-white"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  {project.name}
                </motion.div>
                <div className="max-w-[250px] text-sm font-normal text-gray-400">
                  {project.description}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default SpringAnimatedFeatures;

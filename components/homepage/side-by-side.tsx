'use client';

import { Computer, Network, Zap } from 'lucide-react';
import { OrbitingCirclesComponent } from './orbiting-circles';
import { TITLE_TAILWIND_CLASS } from '@/utils/constants';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    name: 'Build faster',
    description:
      'Get up and running in no time with pre-configured settings and best practices. Say goodbye to setup and focus on what truly matters - building your application.',
    icon: Zap,
  },
  {
    name: 'Production Ready',
    description:
      'Built with modern tools and best practices. Authentication, database, payments, and more - everything you need to launch your SaaS is included.',
    icon: Computer,
  },
  {
    name: 'Scale with ease',
    description:
      'Built on a rock-solid foundation with NextJS, TypeScript, and Tailwind CSS. Deploy with confidence and scale without worry.',
    icon: Network,
  },
];

// Electric highlight component
const ElectricHighlight = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.span
      className="relative inline-block"
    >
      {children}
      <motion.span
        className="absolute inset-0 z-[-1] bg-gradient-to-r from-green-300/30 to-emerald-400/30 rounded-md"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ 
          opacity: [0, 0.4, 0], 
          scale: [0.85, 1.05, 0.85],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          repeatType: "loop", 
          ease: "easeInOut" 
        }}
      />
    </motion.span>
  );
};

export default function SideBySide() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  return (
    <motion.div 
      ref={ref}
      className="overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <motion.div 
            className="lg:pr-8 lg:pt-4"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="lg:max-w-lg">
              <motion.p
                className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold tracking-tight dark:text-white text-gray-900`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <ElectricHighlight>A faster way to production</ElectricHighlight>
              </motion.p>
              <motion.dl 
                className="mt-10 max-w-xl space-y-8 leading-7 text-gray-600 lg:max-w-none"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {features.map((feature, index) => (
                  <motion.div 
                    key={feature.name} 
                    className="relative pl-9"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ 
                      duration: 0.5,
                      delay: 0.4 + (index * 0.1),
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    <dt className="inline font-semibold dark:text-gray-100 text-gray-900">
                      <motion.div
                        className="absolute left-1 top-1 h-5 w-5 text-green-500"
                        whileHover={{ 
                          rotate: 360, 
                          scale: 1.2, 
                          transition: { duration: 0.5 } 
                        }}
                        animate={
                          feature.name === 'Build faster' 
                            ? { 
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.2, 1],
                                transition: { 
                                  duration: 1.5, 
                                  repeat: Infinity, 
                                  repeatDelay: 3
                                }
                              } 
                            : {}
                        }
                      >
                        <feature.icon aria-hidden="true" />
                      </motion.div>
                      <motion.span
                        whileHover={{ color: "#10b981" }}
                        transition={{ duration: 0.2 }}
                      >
                        {feature.name}
                      </motion.span>
                    </dt>{' '}
                    <dd className="inline dark:text-gray-400">{feature.description}</dd>
                  </motion.div>
                ))}
              </motion.dl>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <OrbitingCirclesComponent />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

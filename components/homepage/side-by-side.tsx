'use client';

import { Computer, Network, Zap } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import OrbitingCircles from '@/components/magicui/orbiting-circles';
import Image from 'next/image';

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
      className="overflow-hidden bg-black py-16"
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
              <motion.h2
                className="text-3xl md:text-4xl font-semibold tracking-tight text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                A faster way to production
              </motion.h2>
              <motion.dl 
                className="mt-10 max-w-xl space-y-8 leading-7 text-gray-300 lg:max-w-none"
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
                    <dt className="inline font-semibold text-white mb-1 flex items-start">
                      <motion.div
                        className="absolute left-1 top-1 h-5 w-5 text-green-400"
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
                      <span className="text-green-400">
                        {feature.name}
                      </span>
                    </dt>
                    <dd className="block text-gray-400 mt-1 pl-0">{feature.description}</dd>
                  </motion.div>
                ))}
              </motion.dl>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center"
          >
            {/* Orbiting circles with improved styling */}
            <div className="relative flex h-[500px] w-full max-w-[32rem] items-center justify-center overflow-hidden rounded-lg">
              {/* Glowing background */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl opacity-40"></div>
              
              {/* Central "Build Fast" text */}
              <motion.span 
                className="pointer-events-none whitespace-pre-wrap bg-clip-text text-center text-8xl font-semibold leading-none text-transparent bg-gradient-to-br from-green-400 to-emerald-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                Build Fast
              </motion.span>

              {/* Inner Circles */}
              <OrbitingCircles
                className="h-[30px] w-[30px] border-none bg-transparent"
                duration={20}
                delay={20}
                radius={80}
                path={true}
              >
                <div className="bg-blue-500 p-1 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-xs">TS</span>
                </div>
              </OrbitingCircles>
              
              <OrbitingCircles
                className="h-[30px] w-[30px] border-none bg-transparent"
                duration={20}
                delay={10}
                radius={80}
                path={true}
              >
                <div className="bg-teal-500 p-1 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-xs">TW</span>
                </div>
              </OrbitingCircles>

              {/* Outer Circles (reverse) */}
              <OrbitingCircles
                className="h-[50px] w-[50px] border-none bg-transparent"
                reverse
                radius={190}
                duration={20}
                path={true}
              >
                <div className="bg-white p-1 rounded-md flex items-center justify-center">
                  <span className="text-black font-bold text-sm">N</span>
                </div>
              </OrbitingCircles>
              
              <OrbitingCircles
                className="h-[50px] w-[50px] border-none bg-transparent"
                reverse
                radius={190}
                duration={20}
                delay={20}
                path={true}
              >
                <div className="bg-green-600 p-1 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
              </OrbitingCircles>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

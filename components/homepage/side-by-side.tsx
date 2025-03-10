'use client';

import { Computer, Network, Zap } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import OrbitingCircles from '@/components/magicui/orbiting-circles';
import Image from 'next/image';
import { Cover } from '@/components/ui/cover';

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
      className="overflow-hidden bg-black py-16 w-full"
    >
      <style jsx global>{`
        circle {
          stroke: rgba(74, 222, 128, 0.2) !important;
          stroke-width: 1px !important;
        }
      `}</style>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-12 md:gap-y-16 lg:gap-x-12 lg:max-w-none lg:grid-cols-2">
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
                className="h-[40px] w-[40px] border-none bg-transparent"
                duration={20}
                delay={20}
                radius={80}
                path={true}
              >
                <div className="bg-black/80 border border-green-500/30 backdrop-blur-sm shadow-lg shadow-green-500/10 p-2 rounded-md flex items-center justify-center h-full w-full">
                  <svg viewBox="0 0 256 256" className="h-6 w-6">
                    <path fill="#007ACC" d="M0 128v128h256V0H0z" />
                    <path fill="#FFF" d="M56.611 128.85l-.081 10.483h33.32v94.68h23.568v-94.68h33.32v-10.28c0-5.69-.122-10.444-.284-10.566c-.122-.162-20.399-.244-44.983-.203l-44.739.122l-.121 10.443z" />
                    <path fill="#FFF" d="M206.567 118.108c6.501 1.626 11.459 4.51 16.01 9.224c2.357 2.397 5.851 7.031 6.136 8.12c.081.406-11.093 7.802-17.798 11.987c-.244.165-1.22-.894-2.317-2.52c-3.291-4.795-6.745-6.867-12.028-7.233c-7.76-.528-12.759 3.535-12.718 10.32c0 1.992.284 3.17 1.097 4.795c1.707 3.536 4.876 5.649 14.832 9.956c18.326 7.883 26.168 13.084 31.045 20.48c5.445 8.245 6.664 21.415 2.966 31.208c-4.063 10.646-14.14 17.88-28.323 20.276c-4.388.772-14.79.65-19.504-.203c-10.28-1.829-20.033-6.908-26.047-13.572c-2.357-2.6-6.949-9.387-6.664-9.875c.122-.163 1.178-.813 2.356-1.504c1.138-.65 5.446-3.13 9.509-5.485l7.355-4.267l1.544 2.276c2.154 3.29 6.867 7.801 9.712 9.305c8.167 4.307 19.383 3.698 24.909-1.26c2.357-2.153 3.332-4.388 3.332-7.68c0-2.966-.366-4.266-1.91-6.501c-1.99-2.845-6.054-5.242-17.595-10.24c-13.206-5.69-18.895-9.224-24.096-14.832c-3.007-3.25-5.852-8.452-7.03-12.8c-.975-3.617-1.22-12.678-.447-16.335c2.723-12.76 12.353-21.658 26.25-24.3c4.51-.853 14.994-.528 19.424.569z" />
                  </svg>
                </div>
              </OrbitingCircles>
              
              <OrbitingCircles
                className="h-[40px] w-[40px] border-none bg-transparent"
                duration={20}
                delay={10}
                radius={80}
                path={true}
              >
                <div className="bg-black/80 border border-green-500/30 backdrop-blur-sm shadow-lg shadow-green-500/10 p-2 rounded-md flex items-center justify-center h-full w-full">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-sky-400" fill="currentColor">
                    <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
                  </svg>
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
                <div className="bg-black/80 border border-green-500/30 backdrop-blur-sm shadow-lg shadow-green-500/10 p-2 rounded-md flex items-center justify-center h-full w-full">
                  <svg viewBox="0 0 180 180" className="h-8 w-8">
                    <mask height="180" id="mask0" maskUnits="userSpaceOnUse" width="180" x="0" y="0">
                      <circle cx="90" cy="90" fill="white" r="90"></circle>
                    </mask>
                    <g mask="url(#mask0)">
                      <circle cx="90" cy="90" fill="black" r="90"></circle>
                      <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="white"></path>
                      <rect fill="white" height="72" width="12" x="115" y="54"></rect>
                    </g>
                  </svg>
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
                <div className="bg-black/80 border border-green-500/30 backdrop-blur-sm shadow-lg shadow-green-500/10 p-2 rounded-md flex items-center justify-center h-full w-full">
                  <svg viewBox="0 0 109 113" className="h-7 w-7" fill="none">
                    <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="#3ECF8E"></path>
                    <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint0_linear)"></path>
                    <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.04075L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" fill="#3ECF8E"></path>
                    <defs>
                      <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear" x1="53.9738" x2="94.1635" y1="40.0627" y2="62.0348">
                        <stop stopColor="#3ECF8E" stopOpacity="0"></stop>
                        <stop offset="1" stopColor="#3ECF8E"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </OrbitingCircles>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

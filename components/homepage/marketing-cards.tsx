'use client';
import { TITLE_TAILWIND_CLASS } from '@/utils/constants';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

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

const SpringAnimatedFeatures = () => {
  return (
    <div className="flex flex-col justify-center items-center lg:w-[75%]">
      <div className="flex flex-col mb-[3rem]">
        <h2
          className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold tracking-tight dark:text-white text-gray-900`}
        >
          Built with the best Tech - Minimal friction
        </h2>
        <p className="mx-auto max-w-[600px] text-gray-600 dark:text-gray-400 text-center mt-2 ">
          Your customers deserve your focus - build with tech that just works.
        </p>
      </div>
      <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ProjectsData.map((project) => {
          return (
            <motion.div
              whileHover={{
                y: -8,
              }}
              transition={{
                type: 'spring',
                bounce: 0.7,
              }}
              key={project.id}
              className="mt-5 text-left border p-6 rounded-md dark:bg-black"
            >
              <Link href={project?.url} target="_blank" rel="noopener noreferrer">
                <Image
                  src={project?.imageDark ? project?.imageDark : project.image}
                  width={40}
                  height={30}
                  className="mb-3 rounded"
                  alt={project.name}
                />
                <div className="mb-1 text-sm font-medium ">{project.name}</div>
                <div className="max-w-[250px] text-sm font-normal text-gray-600 dark:text-gray-400">
                  {project.description}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SpringAnimatedFeatures;

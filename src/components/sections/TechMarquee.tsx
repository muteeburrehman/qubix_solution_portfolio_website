'use client';

import { MotionConfig, motion } from 'framer-motion';

const TECH = [
  'Django',
  'FastAPI',
  'Express',
  'Next.js',
  'TypeScript',
  'React',
  'Angular',
  'Flutter',
  'Shopify',
  'WooCommerce',
  'PostgreSQL',
  'RDS',
  'Docker',
  'AWS',
  'Azure',
  'Tailwind CSS',
  'Firebase',
];

export function TechMarquee() {
  const repeated = [...TECH, ...TECH];

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative overflow-hidden border-y border-fg/[0.06] bg-surface/[0.5] py-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />

        <motion.div
          className="flex w-max gap-10 whitespace-nowrap px-10"
          animate={{ x: '-50%' }}
          transition={{
            duration: 40,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {repeated.map((name, idx) => (
            <span
              key={`${name}-${idx}`}
              className="text-xl font-semibold text-fg/25 transition-colors hover:text-accent-600 sm:text-2xl md:text-3xl"
              style={{ transitionDuration: `${200 + idx * 5}ms` }}
            >
              {name.trim()}
              <span aria-hidden className="mx-4 text-accent-500 opacity-75">
                ·
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </MotionConfig>
  );
}

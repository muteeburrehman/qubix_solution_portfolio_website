'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Layers, Code2, Smartphone, ShoppingBag } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-32 lg:pt-40">
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <div className="pointer-events-none absolute -top-36 left-1/2 -z-10 h-[380px] w-[560px] -translate-x-1/2 animate-pulse-glow rounded-full bg-primary/20 blur-[100px] sm:h-[520px] sm:w-[820px] sm:blur-[120px]" />
      <div className="pointer-events-none absolute -right-36 top-16 -z-10 h-[260px] w-[260px] animate-pulse-glow rounded-full bg-accent/15 blur-[90px] sm:h-[340px] sm:w-[340px]" />

      <div className="container-page">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="badge"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent-500" />
            Technology that serves your goals
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-5 text-balance font-display text-[2rem] font-bold leading-[1.08] tracking-tight text-fg sm:mt-6 sm:text-6xl lg:text-7xl"
          >
            We Provide{' '}
            <span className="text-gradient">Solutions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-5 max-w-2xl text-balance text-sm leading-relaxed text-fg/70 sm:mt-6 sm:text-lg"
          >
            Qubix Solutions helps you plan, ship and grow — bespoke software, standout
            web experiences, dependable mobile apps, trusted e-commerce foundations and
            marketing that earns attention — with clear communication from kickoff through
            launch.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex w-full flex-col items-stretch gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:items-center"
          >
            <Link href="/contact" className="btn-primary justify-center">
              Contact us
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/services" className="btn-secondary justify-center">
              Explore services
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-14 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {[
              { icon: Layers, label: 'Custom builds' },
              { icon: Code2, label: 'Web platforms' },
              { icon: Smartphone, label: 'Mobile apps' },
              { icon: ShoppingBag, label: 'E-commerce' },
            ].map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.45 + i * 0.05 }}
                className="card-glass flex items-center justify-center gap-2 px-3 py-3 text-sm text-fg/80"
              >
                <Icon className="h-4 w-4 text-accent-600" />
                <span className="font-medium">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative mx-auto mt-14 max-w-5xl sm:mt-20"
        >
          <div className="absolute -inset-px rounded-3xl bg-gradient-brand opacity-35 blur-xl" />
          <div className="card-glass relative overflow-hidden rounded-3xl border-fg/10 p-1.5 shadow-glow">
            <div className="rounded-[22px] border border-fg/5 bg-gradient-to-br from-surface to-surface-2 p-4 sm:p-10">
              <div className="grid gap-3 sm:grid-cols-3 sm:gap-6">
                {[
                  {
                    metric: '40+',
                    label: 'Production projects shipped',
                  },
                  {
                    metric: '30+',
                    label: 'Satisfied clients',
                  },
                  {
                    metric: '4+',
                    label: 'Years experience',
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-fg/5 bg-fg/[0.02] p-4 sm:p-5"
                  >
                    <div className="text-2xl font-bold text-gradient sm:text-4xl">
                      {s.metric}
                    </div>
                    <div className="mt-1 text-xs text-fg/60 sm:text-sm">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

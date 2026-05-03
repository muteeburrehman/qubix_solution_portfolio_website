'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Bot, Code2, Smartphone, ShoppingBag } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-32 lg:pt-40">
      {/* Decorative grid */}
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[600px] -translate-x-1/2 animate-pulse-glow rounded-full bg-primary/30 blur-[100px] sm:h-[600px] sm:w-[900px] sm:blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-20 -z-10 h-[300px] w-[300px] animate-pulse-glow rounded-full bg-accent/20 blur-[100px] sm:h-[400px] sm:w-[400px] sm:blur-[120px]" />
      <div className="pointer-events-none absolute -left-40 top-60 -z-10 h-[300px] w-[300px] animate-pulse-glow rounded-full bg-magenta/20 blur-[100px] sm:h-[400px] sm:w-[400px] sm:blur-[120px]" />

      <div className="container-page">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="badge"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent-400" />
            AI-first engineering studio
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-5 text-balance font-display text-[2rem] font-bold leading-[1.08] tracking-tight text-fg sm:mt-6 sm:text-6xl lg:text-7xl"
          >
            We build{' '}
            <span className="text-gradient">AI products</span>,{' '}
            <span className="text-gradient">web platforms</span> &{' '}
            <span className="text-gradient">e-commerce</span>{' '}
            that ship.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-5 max-w-2xl text-balance text-sm leading-relaxed text-fg/70 sm:mt-6 sm:text-lg"
          >
            Qubix Solutions designs and engineers production-grade software —
            LLM apps, AI chatbots, n8n automations, scalable Python backends with
            FastAPI & Django, React & Angular web apps, Flutter mobile apps,
            Shopify and WordPress stores — all backed by performance-tuned DevOps
            and growth marketing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex w-full flex-col items-stretch gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:items-center"
          >
            <Link href="/contact" className="btn-primary justify-center">
              Start your project
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
              { icon: Bot, label: 'AI Agents' },
              { icon: Code2, label: 'Web Apps' },
              { icon: Smartphone, label: 'Mobile Apps' },
              { icon: ShoppingBag, label: 'E-commerce' },
            ].map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 + i * 0.06 }}
                className="card-glass flex items-center justify-center gap-2 px-3 py-3 text-sm text-fg/80"
              >
                <Icon className="h-4 w-4 text-accent-400" />
                <span className="font-medium">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative mx-auto mt-14 max-w-5xl sm:mt-20"
        >
          <div className="absolute -inset-px rounded-3xl bg-gradient-brand opacity-40 blur-xl" />
          <div className="card-glass relative overflow-hidden rounded-3xl border-fg/10 p-1.5 shadow-glow">
            <div className="rounded-[22px] border border-fg/5 bg-gradient-to-br from-surface to-surface-2 p-4 sm:p-10">
              <div className="grid gap-3 sm:grid-cols-3 sm:gap-6">
                {[
                  {
                    metric: '40+',
                    label: 'Production projects shipped',
                  },
                  {
                    metric: '99.9%',
                    label: 'Uptime across hosted services',
                  },
                  {
                    metric: '< 1.2s',
                    label: 'Average LCP we deliver',
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

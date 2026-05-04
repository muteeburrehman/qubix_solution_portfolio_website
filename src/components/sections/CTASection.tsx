import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { Section } from '@/components/ui/Section';

export function CTASection() {
  return (
    <Section className="relative">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl border border-fg/10 bg-gradient-to-br from-surface to-surface-2 p-1.5">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-primary/30 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-32 right-0 h-[300px] w-[600px] rounded-full bg-accent/20 blur-[120px]" />

          <div className="relative rounded-[22px] border border-fg/[0.06] bg-background/40 p-6 backdrop-blur-xl sm:p-10 lg:p-16">
            <div className="grid items-center gap-8 lg:grid-cols-[1.6fr,1fr] lg:gap-10">
              <div>
                <span className="badge">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-400 shadow-[0_0_10px_2px_rgba(34,211,238,0.6)]" />
                  Have an idea?
                </span>
                <h2 className="mt-4 text-balance font-display text-2xl font-bold leading-tight text-fg sm:mt-5 sm:text-4xl lg:text-5xl">
                  Let&apos;s build something{' '}
                  <span className="text-gradient">extraordinary</span>.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg/70 sm:mt-4 sm:text-base">
                  Tell us about your product, automation or store and we&apos;ll
                  come back with a clear next step — no forms-to-nowhere, no
                  sales pressure.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/contact" className="btn-primary justify-center">
                  Contact us
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="btn-secondary justify-center break-all"
                >
                  <Mail className="h-4 w-4 flex-none" />
                  <span className="truncate">{siteConfig.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

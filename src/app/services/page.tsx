import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { services } from '@/lib/services';
import { Section, SectionHeading } from '@/components/ui/Section';
import { CTASection } from '@/components/sections/CTASection';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Services — Custom Software, Web, Mobile & E-commerce',
  description:
    'Explore how Qubix helps with custom software, web platforms, mobile apps, Shopify and WooCommerce storefronts, digital marketing & SEO, plus reliable cloud deployments.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <>
      <Section className="pt-24 sm:pt-32 lg:pt-40">
        <div className="container-page">
          <SectionHeading
            eyebrow="Services"
            title={
              <>
                Engineering & consulting for{' '}
                <span className="text-gradient">teams scaling up</span>
              </>
            }
            description="Thoughtful engagements — bespoke software through e-commerce launches — articulated in plain language so your stakeholders know what ships when."
          />
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="container-page space-y-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.slug} delay={Math.min(i * 0.04, 0.2)}>
                <article
                  id={service.slug}
                  className="card-glass relative overflow-hidden rounded-3xl p-6 sm:p-10 scroll-mt-24"
                >
                  <div
                    className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-30 blur-3xl"
                    style={{
                      background:
                        'conic-gradient(from 90deg, #06b6d4, #0ea5e9, #1e40af, #06b6d4)',
                    }}
                  />

                  <div className="relative flex flex-col gap-6 lg:grid lg:grid-cols-[auto,1fr,auto] lg:items-start lg:gap-8">
                    <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                      <div
                        className={`relative inline-grid h-12 w-12 flex-none place-items-center rounded-2xl bg-gradient-to-br ${service.gradient} sm:h-14 sm:w-14`}
                      >
                        <Icon className="h-6 w-6 text-white sm:h-7 sm:w-7" />
                        <div
                          className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-50 blur-md`}
                        />
                      </div>
                      <h2 className="font-display text-xl font-bold leading-tight text-fg sm:text-2xl lg:hidden">
                        {service.title}
                      </h2>
                    </div>

                    <div className="min-w-0">
                      <h2 className="hidden font-display text-2xl font-bold text-fg sm:text-3xl lg:block">
                        {service.title}
                      </h2>
                      <p className="text-sm leading-relaxed text-fg/70 sm:text-base lg:mt-3">
                        {service.description}
                      </p>

                      <ul className="mt-5 grid gap-2 sm:grid-cols-2 sm:mt-6">
                        {service.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex items-start gap-2 text-sm text-fg/80"
                          >
                            <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-primary/20 text-primary-300">
                              <Check className="h-3 w-3" />
                            </span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-5 flex flex-wrap gap-1.5 sm:mt-6">
                        {service.stack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-fg/10 bg-fg/[0.02] px-3 py-1 text-xs font-medium text-fg/70"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="lg:self-center">
                      <Link
                        href="/contact"
                        className="btn-primary w-full justify-center whitespace-nowrap sm:w-auto"
                      >
                        Discuss this
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <CTASection />
    </>
  );
}

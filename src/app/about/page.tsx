import type { Metadata } from 'next';
import { Section, SectionHeading } from '@/components/ui/Section';
import { CTASection } from '@/components/sections/CTASection';
import { Reveal } from '@/components/ui/Reveal';
import { Target, Heart, Lightbulb, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About — A senior team building AI-first software',
  description:
    'Qubix Solutions is a small, senior engineering studio that builds AI products, web platforms, mobile apps and e-commerce stores for ambitious teams.',
  alternates: { canonical: '/about' },
};

const values = [
  {
    icon: Target,
    title: 'Outcome over output',
    description:
      'We measure success in your KPIs — revenue, retention, conversion — not in lines of code or tickets closed.',
  },
  {
    icon: Heart,
    title: 'Craft & care',
    description:
      'Pixel-perfect UI, clean code, accessible interfaces. The little things compound.',
  },
  {
    icon: Lightbulb,
    title: 'Pragmatic AI',
    description:
      'We use AI where it adds real value, not for the demo reel. Boring infrastructure beats hype.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted partner',
    description:
      'Transparent pricing, clear communication and shared ownership of the roadmap.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Section className="pt-24 sm:pt-32 lg:pt-40">
        <div className="container-page">
          <SectionHeading
            eyebrow="About Qubix"
            title={
              <>
                A senior studio for{' '}
                <span className="text-gradient">AI-first software</span>
              </>
            }
            description="We are a focused team of engineers, designers and growth specialists. Small on purpose — so every client works directly with the people building their product."
          />

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-3">
            {[
              { value: '10+', label: 'Years combined experience' },
              { value: '40+', label: 'Production projects shipped' },
              { value: '4 / 4.5', label: 'Avg. CSAT across engagements' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.05}>
                <div className="card-glass rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-gradient sm:text-4xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-sm text-fg/60">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="container-page">
          <div className="card-glass mx-auto max-w-4xl rounded-3xl p-8 sm:p-12">
            <h2 className="font-display text-2xl font-bold text-fg sm:text-3xl">
              Our mission
            </h2>
            <p className="mt-4 text-base leading-relaxed text-fg/75 sm:text-lg">
              We believe great software should be{' '}
              <span className="text-fg">fast</span>,{' '}
              <span className="text-fg">delightful</span> and{' '}
              <span className="text-fg">measurably useful</span>. Our mission
              is to give startups and growing businesses access to the same
              caliber of engineering and design that big tech companies enjoy —
              without the bloat, slowness or six-figure retainers.
            </p>
            <p className="mt-4 text-base leading-relaxed text-fg/75 sm:text-lg">
              Whether it&apos;s an AI agent that resolves customer support
              tickets, a Shopify store that converts at 3x the industry
              average, a Flutter app that feels native on every device, or an
              n8n automation that saves your team 30 hours a week — we treat
              every project like it&apos;s our own product.
            </p>
          </div>
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we value"
            title={
              <>
                Principles that guide{' '}
                <span className="text-gradient">every project</span>
              </>
            }
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.title} delay={i * 0.05}>
                  <div className="card-glass h-full rounded-2xl p-6">
                    <div className="inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-fg">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-fg/60">
                      {v.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      <CTASection />
    </>
  );
}

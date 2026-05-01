import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'Qubix delivered our AI support agent in 6 weeks. It now handles 78% of tickets autonomously and our customers love it.',
    name: 'Head of Customer Experience',
    company: 'B2B SaaS company',
  },
  {
    quote:
      'They re-platformed our 12k-SKU Shopify store onto Hydrogen. Conversion up 34%, mobile LCP under 1.2s. The team is sharp, fast and easy to work with.',
    name: 'CMO',
    company: 'Fashion DTC brand',
  },
  {
    quote:
      'Our n8n automations save 30+ hours a week. What used to be six manual workflows is now one observable, retry-safe pipeline.',
    name: 'Director of Operations',
    company: 'Mid-market e-commerce',
  },
];

export function Testimonials() {
  return (
    <Section className="relative">
      <div className="container-page">
        <SectionHeading
          eyebrow="What clients say"
          title={
            <>
              Trusted by teams that{' '}
              <span className="text-gradient">care about quality</span>
            </>
          }
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="card-glass relative h-full rounded-2xl p-7">
                <Quote className="h-7 w-7 text-primary-400" />
                <p className="mt-4 text-base leading-relaxed text-fg/85">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 border-t border-fg/[0.06] pt-4">
                  <div className="text-sm font-semibold text-fg">
                    {t.name}
                  </div>
                  <div className="text-xs text-fg/55">{t.company}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

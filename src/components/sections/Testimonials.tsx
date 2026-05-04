import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'Qubix tightened our Shopify experience and the buying path finally matches how our customers actually shop. Conversion followed without a painful replatform.',
    name: 'CMO',
    company: 'Fashion DTC brand',
  },
  {
    quote:
      'They spoke in roadmaps and milestones we could take to the board — not jargon. Our internal tools finally match how the team really works.',
    name: 'Director of Operations',
    company: 'Regional distributor',
  },
  {
    quote:
      'Shipping our mobile app felt collaborative, not chaotic. Store reviews, analytics and handover notes were all there on day one.',
    name: 'Founder',
    company: 'Fitness & coaching startup',
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
                <Quote className="h-7 w-7 text-primary-500" />
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

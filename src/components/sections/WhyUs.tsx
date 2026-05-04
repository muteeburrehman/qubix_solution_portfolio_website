import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import {
  ShieldCheck,
  Gauge,
  Users,
  Sparkles,
  Layers,
  Clock,
} from 'lucide-react';

const reasons = [
  {
    icon: Sparkles,
    title: 'Partnership mindset',
    description:
      'We align on outcomes, timelines and trade-offs upfront — then keep priorities clear as the roadmap evolves.',
  },
  {
    icon: Gauge,
    title: 'Performance obsessed',
    description:
      'Sub-second load times, optimized images, edge caching and Lighthouse scores above 95.',
  },
  {
    icon: ShieldCheck,
    title: 'Production-grade security',
    description:
      'Hardened auth, secrets management, rate-limiting, audit logs and OWASP-aligned defaults.',
  },
  {
    icon: Users,
    title: 'Senior engineers only',
    description:
      'No juniors hiding behind PMs. You talk to the people writing the code, every week.',
  },
  {
    icon: Layers,
    title: 'Full-stack ownership',
    description:
      'Strategy, UX, engineering, storefronts and mobile — one accountable team, with tidy handovers when you want to operate in-house.',
  },
  {
    icon: Clock,
    title: 'On-time, on-budget',
    description:
      'Fixed milestones, weekly demos and clear scope. No vague timelines, no scope creep surprises.',
  },
];

export function WhyUs() {
  return (
    <Section className="relative">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why Qubix"
          title={
            <>
              We ship like a startup,{' '}
              <span className="text-gradient">engineer like an enterprise</span>
            </>
          }
          description="A small, senior team that has shipped to millions of users — focused on outcomes, not billable hours."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <Reveal key={r.title} delay={i * 0.05}>
                <div className="card-glass group h-full rounded-2xl p-6 transition-all duration-300 hover:border-fg/15 hover:bg-fg/[0.04]">
                  <div className="inline-grid h-11 w-11 place-items-center rounded-xl border border-fg/10 bg-fg/[0.04] text-accent-400 transition-colors group-hover:text-accent-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-fg">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg/60">
                    {r.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

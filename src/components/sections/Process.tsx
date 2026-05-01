import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Compass, PencilRuler, Code, Rocket } from 'lucide-react';

const steps = [
  {
    icon: Compass,
    title: 'Discover',
    description:
      'We dive deep into your goals, users and constraints — and shape a clear, scoped plan with measurable outcomes.',
  },
  {
    icon: PencilRuler,
    title: 'Design',
    description:
      'Wireframes, prototypes and architecture diagrams. Every flow, screen and API contract reviewed before we build.',
  },
  {
    icon: Code,
    title: 'Build',
    description:
      'Senior engineers ship in weekly sprints with code reviews, automated tests and continuous deployments.',
  },
  {
    icon: Rocket,
    title: 'Launch & scale',
    description:
      'We deploy to your cloud (Hetzner, AWS, GCP), monitor everything and iterate based on real user data.',
  },
];

export function Process() {
  return (
    <Section className="relative">
      <div className="container-page">
        <SectionHeading
          eyebrow="How we work"
          title={
            <>
              A simple,{' '}
              <span className="text-gradient">battle-tested process</span>
            </>
          }
          description="Transparent communication, weekly demos and shipping in small slices — no surprises, just steady progress."
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={i * 0.05}>
                <div className="card-glass relative h-full rounded-2xl p-6">
                  <div className="absolute right-5 top-5 font-display text-5xl font-bold leading-none text-fg/[0.06]">
                    0{i + 1}
                  </div>
                  <div className="relative inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand">
                    <Icon className="h-5 w-5 text-white" />
                    <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-brand opacity-50 blur-md" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-fg">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg/60">
                    {step.description}
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

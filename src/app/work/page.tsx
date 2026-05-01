import type { Metadata } from 'next';
import { projects } from '@/lib/projects';
import { Section, SectionHeading } from '@/components/ui/Section';
import { CTASection } from '@/components/sections/CTASection';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Our Work — Case Studies & Projects',
  description:
    'A selection of AI, web, mobile and e-commerce projects we have built — case studies with real metrics and outcomes.',
  alternates: { canonical: '/work' },
};

export default function WorkPage() {
  return (
    <>
      <Section className="pt-24 sm:pt-32 lg:pt-40">
        <div className="container-page">
          <SectionHeading
            eyebrow="Selected work"
            title={
              <>
                Case studies built for{' '}
                <span className="text-gradient">real outcomes</span>
              </>
            }
            description="A snapshot of recent engagements across AI, web, mobile and e-commerce. Names withheld under NDA — happy to share details on a call."
          />
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i * 0.05, 0.25)}>
              <article className="card-glass group relative h-full overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-fg/15 sm:p-8">
                <div className="absolute -inset-px -z-10 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div
                    className={`h-full w-full rounded-3xl bg-gradient-to-br ${p.gradient} opacity-30 blur-xl`}
                  />
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="badge">{p.category}</span>
                    <h3 className="mt-3 font-display text-xl font-bold leading-tight text-fg sm:mt-4 sm:text-3xl">
                      {p.title}
                    </h3>
                  </div>
                  <div
                    className={`h-12 w-12 flex-none rounded-2xl bg-gradient-to-br ${p.gradient} opacity-90 sm:h-16 sm:w-16`}
                  />
                </div>

                <p className="mt-3 text-sm leading-relaxed text-fg/75 sm:mt-4 sm:text-base">
                  {p.summary}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fg/55 sm:mt-3">
                  {p.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5 sm:mt-6">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-fg/10 bg-fg/[0.02] px-2.5 py-1 text-[11px] font-medium text-fg/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-fg/[0.06] pt-5 sm:mt-6 sm:gap-3 sm:pt-6">
                  {p.metrics.map((m) => (
                    <div key={m.label} className="min-w-0">
                      <div className="text-lg font-bold text-gradient sm:text-2xl">
                        {m.value}
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-wider text-fg/50 sm:text-[11px]">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection />
    </>
  );
}

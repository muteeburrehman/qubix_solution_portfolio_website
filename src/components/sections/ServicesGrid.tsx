import { services } from '@/lib/services';
import { ServiceCard } from './ServiceCard';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';

export function ServicesGrid({ withHeading = true }: { withHeading?: boolean }) {
  return (
    <Section id="services" className="relative">
      <div className="container-page">
        {withHeading ? (
          <SectionHeading
            eyebrow="What we build"
            title={
              <>
                Partners for{' '}
                <span className="text-gradient">growth-minded teams</span>
              </>
            }
            description="Whether you need a flagship site, bespoke software behind the scenes or a shop that converts — we focus on clarity, timelines you can trust and outcomes your stakeholders recognise."
          />
        ) : null}

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={Math.min(i * 0.05, 0.3)}>
              <ServiceCard
                service={service}
                href={`/services#${service.slug}`}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

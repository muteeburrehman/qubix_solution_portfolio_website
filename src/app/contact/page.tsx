import type { Metadata } from 'next';
import { Mail, Globe, MessageSquare } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ContactForm } from '@/components/sections/ContactForm';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact — Qubix Solutions',
  description:
    'Get in touch about custom software, web, mobile, e-commerce storefronts or marketing — we will reply with a clear next step.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <Section className="pt-24 sm:pt-32 lg:pt-40">
      <div className="container-page">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Tell us about{' '}
              <span className="text-gradient">your project</span>
            </>
          }
          description="Share a few details and we’ll get back to you with a clear next step — discovery call, scoped proposal or a quick answer."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr,1.4fr]">
          <aside className="space-y-4">
            <InfoCard
              icon={Mail}
              title="Email us"
              text={siteConfig.email}
              href={`mailto:${siteConfig.email}`}
            />
            <InfoCard
              icon={Globe}
              title="Website"
              text={siteConfig.domain}
              href={siteConfig.url}
            />
            <InfoCard
              icon={MessageSquare}
              title="Prefer email?"
              text={`Drop us a note at ${siteConfig.email}`}
              href={`mailto:${siteConfig.email}`}
            />

            <div className="card-glass rounded-2xl p-6">
              <h3 className="font-display text-lg font-semibold text-fg">
                What happens next?
              </h3>
              <ol className="mt-3 space-y-2 text-sm text-fg/70">
                <li className="flex gap-2">
                  <span className="font-semibold text-accent-400">1.</span>
                  We review your request and any context you share.
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-accent-400">2.</span>
                  We schedule a 30-min discovery call — free, no pressure.
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-accent-400">3.</span>
                  You get a scoped proposal with timeline &amp; pricing.
                </li>
              </ol>
            </div>
          </aside>

          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </Section>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="grid h-10 w-10 flex-none place-items-center rounded-xl border border-fg/10 bg-fg/[0.04] text-accent-400">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-fg/50">
          {title}
        </div>
        <div className="mt-1 truncate text-sm font-medium text-fg sm:text-base">
          {text}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="card-glass block rounded-2xl p-5 transition-colors hover:bg-fg/[0.04]"
      >
        {content}
      </a>
    );
  }
  return <div className="card-glass rounded-2xl p-5">{content}</div>;
}

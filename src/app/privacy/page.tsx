import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for ${siteConfig.name}.`,
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <Section className="pt-24 sm:pt-32 lg:pt-40">
      <div className="container-page">
        <article className="card-glass mx-auto max-w-3xl rounded-3xl p-8 sm:p-12">
          <h1 className="font-display text-3xl font-bold text-fg sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-fg/60">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="mt-6 space-y-5 text-fg/75">
            <p>
              {siteConfig.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates {siteConfig.url}. This page informs you of our policies regarding the collection, use and disclosure of personal information.
            </p>

            <h2 className="text-xl font-semibold text-fg">Information we collect</h2>
            <p>
              When you contact us through our website, we collect the information you submit (name, email, company, phone, project details). We do not sell or rent your personal information to third parties.
            </p>

            <h2 className="text-xl font-semibold text-fg">How we use information</h2>
            <p>
              We use submitted information solely to respond to your inquiry, prepare a proposal, and follow up about your project. We retain it for as long as needed to provide our services and as required by applicable law.
            </p>

            <h2 className="text-xl font-semibold text-fg">Cookies & analytics</h2>
            <p>
              We may use privacy-friendly analytics (such as Plausible or self-hosted analytics) to understand aggregate usage of our site. We do not use cookies for advertising or third-party tracking.
            </p>

            <h2 className="text-xl font-semibold text-fg">Your rights</h2>
            <p>
              You may request access, correction or deletion of your personal information at any time by emailing us at{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-accent-400 hover:text-accent-300">
                {siteConfig.email}
              </a>
              .
            </p>

            <h2 className="text-xl font-semibold text-fg">Contact</h2>
            <p>
              For any privacy questions, reach out at{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-accent-400 hover:text-accent-300">
                {siteConfig.email}
              </a>
              .
            </p>
          </div>
        </article>
      </div>
    </Section>
  );
}

import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of service for ${siteConfig.name}.`,
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <Section className="pt-24 sm:pt-32 lg:pt-40">
      <div className="container-page">
        <article className="card-glass mx-auto max-w-3xl rounded-3xl p-8 sm:p-12">
          <h1 className="font-display text-3xl font-bold text-fg sm:text-4xl">
            Terms of Service
          </h1>
          <p className="text-fg/60">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="mt-6 space-y-5 text-fg/75">
            <p>
              By accessing {siteConfig.url} you agree to these terms. If you do not agree, please do not use this website.
            </p>

            <h2 className="text-xl font-semibold text-fg">Use of website</h2>
            <p>
              Content on this site is provided for informational purposes. You may not redistribute, scrape or use it to train models without prior written consent.
            </p>

            <h2 className="text-xl font-semibold text-fg">Engagements & contracts</h2>
            <p>
              All client engagements are governed by a separate Master Services Agreement and Statement of Work signed by both parties. Nothing on this website constitutes a binding offer.
            </p>

            <h2 className="text-xl font-semibold text-fg">Intellectual property</h2>
            <p>
              Trademarks, logos, brand names and case-study content remain the property of their respective owners. {siteConfig.name} retains rights to its own brand and materials.
            </p>

            <h2 className="text-xl font-semibold text-fg">Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, {siteConfig.name} is not liable for any indirect, incidental or consequential damages arising from use of this website.
            </p>

            <h2 className="text-xl font-semibold text-fg">Contact</h2>
            <p>
              Questions? Email us at{' '}
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

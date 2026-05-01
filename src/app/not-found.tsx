import Link from 'next/link';
import { ArrowRight, Home } from 'lucide-react';
import { Section } from '@/components/ui/Section';

export default function NotFound() {
  return (
    <Section className="pt-24 sm:pt-32 lg:pt-40">
      <div className="container-page">
        <div className="card-glass mx-auto max-w-2xl rounded-3xl p-10 text-center sm:p-14">
          <div className="text-6xl font-bold text-gradient sm:text-8xl">
            404
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-fg sm:text-3xl">
            We couldn&apos;t find that page
          </h1>
          <p className="mt-3 text-fg/70">
            The link may be broken or the page may have been moved.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn-primary">
              <Home className="h-4 w-4" />
              Back home
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

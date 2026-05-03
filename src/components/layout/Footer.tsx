import Link from 'next/link';
import { Mail, Linkedin, Twitter, Github, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { services } from '@/lib/services';
import { Logo } from './Logo';

const companyLinks = [
  { name: 'About', href: '/about' },
  { name: 'Work', href: '/work' },
  { name: 'Contact', href: '/contact' },
  { name: 'Privacy', href: '/privacy' },
  { name: 'Terms', href: '/terms' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-fg/[0.06] bg-surface/40 backdrop-blur-xl sm:mt-24">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="container-page py-12 sm:py-16">
        {/* ---------- Top row: brand block ---------- */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-fg/70">
              {siteConfig.description}
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-fg/10 bg-fg/[0.03] px-4 py-2 text-xs text-fg/90 transition-colors hover:bg-fg/[0.06] sm:text-sm"
            >
              <Mail className="h-4 w-4 flex-none text-accent-400" />
              <span className="truncate">{siteConfig.email}</span>
            </a>
          </div>

          {/* ---------- Link columns ---------- */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-3 lg:gap-10">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-fg/90">
                Services
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services#${s.slug}`}
                      className="text-fg/60 transition-colors hover:text-fg"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-fg/90">
                Company
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {companyLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-fg/60 transition-colors hover:text-fg"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-fg/90">
                Get in touch
              </h4>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg/60">
                Tell us about your project — we&apos;d love to hear what
                you&apos;re building.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-fg transition-colors hover:text-accent-400"
              >
                Start a project
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <div className="mt-5 flex items-center gap-2">
                <SocialLink
                  href={siteConfig.social.linkedin}
                  label="LinkedIn"
                  icon={Linkedin}
                />
                <SocialLink
                  href={siteConfig.social.twitter}
                  label="Twitter"
                  icon={Twitter}
                />
                <SocialLink
                  href={siteConfig.social.github}
                  label="GitHub"
                  icon={Github}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Bottom bar ---------- */}
      <div className="border-t border-fg/[0.06]">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-5 text-xs text-fg/50 sm:flex-row sm:items-center sm:gap-3 sm:py-6">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-balance">
            Built with Next.js, Tailwind CSS &amp; Framer Motion. Engineered for
            performance &amp; SEO.
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-fg/10 bg-fg/[0.03] text-fg/70 transition-colors hover:bg-fg/[0.06] hover:text-fg"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

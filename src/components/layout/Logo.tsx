import Link from 'next/link';
import { siteConfig } from '@/lib/site';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand shadow-glow transition-transform duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="h-5 w-5 text-white"
          fill="none"
        >
          <path
            d="M4 7.5L12 3l8 4.5v9L12 21l-8-4.5v-9z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M12 3v18M4 7.5l8 4.5 8-4.5M4 16.5l8-4.5 8 4.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
            opacity="0.7"
          />
        </svg>
        <span className="absolute inset-0 -z-10 rounded-xl bg-gradient-brand opacity-50 blur-md transition-opacity duration-300 group-hover:opacity-80" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-base font-bold tracking-tight text-fg">
          Qubix
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-fg/60">
          Solutions
        </span>
      </span>
    </Link>
  );
}

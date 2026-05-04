import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/lib/site';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl shadow-md ring-1 ring-fg/[0.08] transition-transform duration-300 group-hover:scale-[1.03]">
        <Image
          src="/brand/logo.png"
          alt=""
          width={40}
          height={40}
          priority
          className="object-cover"
          sizes="40px"
        />
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

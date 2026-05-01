import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Service } from '@/lib/services';

export function ServiceCard({
  service,
  href,
}: {
  service: Service;
  href?: string;
}) {
  const Icon = service.icon;
  const Tag: React.ElementType = href ? Link : 'div';

  return (
    <div className="group relative h-full">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-fg/10 to-fg/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <Tag
        {...(href ? { href } : {})}
        className="card-glass relative flex h-full flex-col gap-5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-fg/15 hover:bg-fg/[0.04]"
      >
        <div className="flex items-start justify-between gap-4">
          <div
            className={`relative inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${service.gradient}`}
          >
            <Icon className="h-6 w-6 text-white" />
            <div
              className={`absolute inset-0 -z-10 rounded-xl bg-gradient-to-br ${service.gradient} opacity-50 blur-md`}
            />
          </div>
          {href ? (
            <span className="grid h-8 w-8 place-items-center rounded-full border border-fg/10 bg-fg/[0.02] text-fg/60 transition-all duration-300 group-hover:border-fg/20 group-hover:text-fg">
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
            </span>
          ) : null}
        </div>

        <div>
          <h3 className="font-display text-xl font-semibold text-fg">
            {service.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-fg/60">
            {service.short}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5">
          {service.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-fg/10 bg-fg/[0.02] px-2.5 py-1 text-[11px] font-medium text-fg/70"
            >
              {tech}
            </span>
          ))}
        </div>
      </Tag>
    </div>
  );
}

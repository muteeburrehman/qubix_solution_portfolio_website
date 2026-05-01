import { cn } from '@/lib/utils';

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  as?: 'section' | 'div';
  children: React.ReactNode;
};

export function Section({
  as: Tag = 'section',
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn('relative py-14 sm:py-20 lg:py-28', className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mx-auto flex max-w-3xl flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start',
        className,
      )}
    >
      {eyebrow ? (
        <span className="badge">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-400 shadow-[0_0_10px_2px_rgba(34,211,238,0.6)]" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-balance text-2xl font-bold leading-tight text-fg sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-fg/70 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

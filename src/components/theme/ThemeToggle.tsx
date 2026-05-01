'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === 'dark' : true;
  const next = isDark ? 'light' : 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      onClick={() => setTheme(next)}
      suppressHydrationWarning
      className={cn(
        'relative grid h-10 w-10 place-items-center overflow-hidden rounded-full',
        'border border-fg/10 bg-fg/[0.04] text-fg transition-colors',
        'hover:bg-fg/[0.08] hover:border-fg/20',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60',
        className,
      )}
    >
      <Sun
        className={cn(
          'absolute h-[18px] w-[18px] transition-all duration-300',
          isDark
            ? 'rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100',
        )}
        aria-hidden
      />
      <Moon
        className={cn(
          'absolute h-[18px] w-[18px] transition-all duration-300',
          isDark
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0',
        )}
        aria-hidden
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

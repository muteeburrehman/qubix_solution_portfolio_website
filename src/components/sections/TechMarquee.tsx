'use client';

const techs = [
  'Next.js',
  'React',
  'Angular',
  'TypeScript',
  'Node.js',
  'Flutter',
  'OpenAI',
  'Anthropic',
  'LangChain',
  'Pinecone',
  'n8n',
  'Shopify',
  'Hydrogen',
  'WordPress',
  'WooCommerce',
  'Tailwind CSS',
  'PostgreSQL',
  'Redis',
  'Docker',
  'Nginx',
  'Hetzner',
  'AWS',
  'Cloudflare',
  'Stripe',
  'Firebase',
  'Supabase',
];

export function TechMarquee() {
  const list = [...techs, ...techs];
  return (
    <div className="relative border-y border-fg/[0.06] bg-surface/40 py-10 backdrop-blur">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {list.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="text-base font-medium text-fg/40 transition-colors hover:text-fg"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

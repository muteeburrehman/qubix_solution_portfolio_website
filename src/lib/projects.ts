export type Project = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  gradient: string;
};

export const projects: Project[] = [
  {
    slug: 'ai-support-agent',
    title: 'AI Customer Support Agent',
    category: 'AI / LLM',
    summary:
      'A multi-channel AI agent that resolves 78% of support tickets autonomously across web chat and email.',
    description:
      'Built a RAG-powered support agent for a SaaS client using GPT-4o, Pinecone and a custom Node.js orchestration layer. Integrated with Intercom, Zendesk and HubSpot, with human-handover, sentiment detection and full conversation analytics.',
    tags: ['GPT-4o', 'RAG', 'Pinecone', 'Node.js', 'Intercom'],
    metrics: [
      { label: 'Tickets auto-resolved', value: '78%' },
      { label: 'Languages supported', value: '12' },
      { label: 'CSAT score', value: '4.7 / 5' },
    ],
    gradient: 'from-violet-500 via-fuchsia-500 to-cyan-400',
  },
  {
    slug: 'shopify-fashion-store',
    title: 'Headless Shopify Fashion Store',
    category: 'E-commerce',
    summary:
      'Migrated a fashion brand from a slow theme to a headless Hydrogen storefront — 3.2x faster checkout.',
    description:
      'Re-platformed a 12,000-SKU fashion store onto Shopify Hydrogen with Remix. Implemented predictive search, AI-powered product recommendations, and Klaviyo flows that lifted email revenue by 41%.',
    tags: ['Shopify Hydrogen', 'Remix', 'Klaviyo', 'Algolia'],
    metrics: [
      { label: 'LCP', value: '1.1s' },
      { label: 'Conversion lift', value: '+34%' },
      { label: 'Email revenue', value: '+41%' },
    ],
    gradient: 'from-emerald-400 via-teal-400 to-cyan-400',
  },
  {
    slug: 'flutter-fitness-app',
    title: 'Flutter Fitness & Coaching App',
    category: 'Mobile',
    summary:
      'A cross-platform fitness app with AI-generated workout plans and live coach video sessions.',
    description:
      'Designed and shipped a Flutter app for iOS and Android with Firebase backend, Stripe subscriptions and OpenAI-powered personalized workout plans. Live video coaching via Agora SDK.',
    tags: ['Flutter', 'Firebase', 'Stripe', 'OpenAI', 'Agora'],
    metrics: [
      { label: 'App Store rating', value: '4.8 / 5' },
      { label: 'Subscribers', value: '12k+' },
      { label: 'Crash-free sessions', value: '99.7%' },
    ],
    gradient: 'from-sky-400 via-cyan-400 to-teal-400',
  },
  {
    slug: 'n8n-finance-automation',
    title: 'n8n Finance Operations Automation',
    category: 'Automation',
    summary:
      'Replaced 6 manual finance workflows with self-hosted n8n — saving 30+ hours per week.',
    description:
      'Self-hosted n8n on Hetzner with custom Node.js nodes to automate invoice ingestion (OCR + GPT-4o classification), reconciliation against QuickBooks, Slack approvals and ledger posting.',
    tags: ['n8n', 'Node.js', 'GPT-4o', 'QuickBooks', 'Hetzner'],
    metrics: [
      { label: 'Hours saved / week', value: '30+' },
      { label: 'Workflows automated', value: '6' },
      { label: 'Error rate', value: '-92%' },
    ],
    gradient: 'from-fuchsia-500 via-pink-500 to-rose-500',
  },
  {
    slug: 'react-saas-dashboard',
    title: 'React SaaS Analytics Dashboard',
    category: 'Web',
    summary:
      'A real-time analytics SaaS dashboard built with Next.js 15, tRPC and Postgres.',
    description:
      'Built a multi-tenant SaaS dashboard with real-time charts, role-based access, Stripe billing and an embedded AI assistant. Deployed on Hetzner with Docker, Nginx and zero-downtime releases.',
    tags: ['Next.js 15', 'tRPC', 'Postgres', 'Stripe', 'Docker'],
    metrics: [
      { label: 'Lighthouse score', value: '99' },
      { label: 'Tenants onboarded', value: '120+' },
      { label: 'p95 API latency', value: '85ms' },
    ],
    gradient: 'from-indigo-500 via-violet-500 to-purple-500',
  },
  {
    slug: 'wordpress-news-portal',
    title: 'WooCommerce + Headless News Portal',
    category: 'E-commerce',
    summary:
      'A high-traffic WordPress news portal with a WooCommerce subscription paywall.',
    description:
      'Custom WordPress + WooCommerce build with a Next.js front-end pulling from the WP REST API. Subscription paywall, paid newsletters, advanced caching and a custom editorial workflow.',
    tags: ['WordPress', 'WooCommerce', 'Next.js', 'Redis', 'Cloudflare'],
    metrics: [
      { label: 'Monthly pageviews', value: '4M+' },
      { label: 'TTFB', value: '120ms' },
      { label: 'Paid subscribers', value: '8k+' },
    ],
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
  },
];

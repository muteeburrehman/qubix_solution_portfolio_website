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
    slug: 'custom-integrations-suite',
    title: 'Operations Integrations Portal',
    category: 'Custom Software',
    summary:
      'Connected finance, ERP and ticketing so one team dashboard replaced six weekly spreadsheets.',
    description:
      'Partnered with a mid-market distributor to map messy handoffs between accounting and ops. Delivered Django and FastAPI services on RDS-backed PostgreSQL, disciplined REST contracts and pragmatic reporting their leadership trusts during Monday reviews.',
    tags: ['Django', 'FastAPI', 'RDS', 'PostgreSQL', 'Express'],
    metrics: [
      { label: 'Manual reconciliation', value: '-64%' },
      { label: 'Live integrations', value: '11' },
      { label: 'Go-live timeline', value: '14 weeks' },
    ],
    gradient: 'from-cyan-500 via-teal-500 to-blue-700',
  },
  {
    slug: 'shopify-fashion-store',
    title: 'Shopify Fashion Growth Program',
    category: 'E-commerce',
    summary:
      'Refreshed a slow theme into a sharper Shopify experience — tighter checkout lifted conversion.',
    description:
      'Rebuilt collections, PDP storytelling and onsite search for a twelve-thousand-SKU apparel brand. Connected Klaviyo flows and merchandising tweaks that behaved predictably — no surprise theme breaking during peak season.',
    tags: ['Shopify', 'Liquid', 'Remix', 'Klaviyo', 'Algolia'],
    metrics: [
      { label: 'Checkout uplift', value: '+31%' },
      { label: 'Mobile conversion', value: '+28%' },
      { label: 'Email revenue lift', value: '+36%' },
    ],
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
  },
  {
    slug: 'flutter-fitness-app',
    title: 'Fitness & Coaching Companion',
    category: 'Mobile',
    summary:
      'Cross-platform companion app bridging coaches, payouts and personalised training plans.',
    description:
      'Shipped Flutter clients for iOS and Android backed by Firebase, Stripe subscriptions for coaching tiers and pragmatic offline-friendly workouts. Guided the client through store metadata, release cadence and support playbooks.',
    tags: ['Flutter', 'Dart', 'Firebase', 'Stripe', 'Kotlin'],
    metrics: [
      { label: 'App Store rating', value: '4.8 / 5' },
      { label: 'Active subscribers', value: '11k+' },
      { label: 'Crash-free sessions', value: '99.7%' },
    ],
    gradient: 'from-sky-500 via-cyan-500 to-teal-600',
  },
  {
    slug: 'workflow-automation-blueprint',
    title: 'Workflow Automation Blueprint',
    category: 'Custom Software',
    summary:
      'Standardised onboarding and approvals previously trapped inside email chains.',
    description:
      'Facilitated discovery workshops, then coded durable automations spanning CRM, spreadsheets and invoicing portals. Operators gained traceable statuses instead of ambiguous forwards — morale followed.',
    tags: ['Node.js', 'TypeScript', 'PostgreSQL', 'Azure', 'Webhooks'],
    metrics: [
      { label: 'Hours saved weekly', value: '28+' },
      { label: 'Workflows templated', value: '9' },
      { label: 'Escalations reduced', value: '-47%' },
    ],
    gradient: 'from-cyan-500 via-blue-600 to-slate-900',
  },
  {
    slug: 'react-saas-dashboard',
    title: 'SaaS Analytics Experience',
    category: 'Web',
    summary:
      'Responsive analytics cockpit with tenant isolation and predictable billing UX.',
    description:
      'Crafted Next.js dashboards with granular roles, Postgres-backed metrics and Stripe checkout flows teammates could demo confidently. Wrapped releases in GitHub Actions and smoke tests stakeholders understood.',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Docker'],
    metrics: [
      { label: 'Lighthouse perf', value: '97+' },
      { label: 'Tenants launched', value: '110+' },
      { label: 'p95 API latency', value: '< 90 ms' },
    ],
    gradient: 'from-blue-600 via-indigo-500 to-cyan-500',
  },
  {
    slug: 'wordpress-news-portal',
    title: 'Editorial WooCommerce Subscription',
    category: 'E-commerce',
    summary:
      'High-traffic newsroom with memberships, paywalls and storefront discipline.',
    description:
      'WordPress backbone with WooCommerce powering subscriptions alongside a disciplined Next.js reading experience. Editors kept familiar tools while readers benefited from faster article loads via Cloudflare-managed caching.',
    tags: ['WordPress', 'WooCommerce', 'Next.js', 'Redis', 'Cloudflare'],
    metrics: [
      { label: 'Monthly reads', value: '3.8M+' },
      { label: 'TTFB (cached)', value: '130 ms' },
      { label: 'Paying subscribers', value: '7.5k+' },
    ],
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
  },
];

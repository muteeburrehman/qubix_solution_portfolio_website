import {
  Code2,
  Layers,
  ShoppingBag,
  Smartphone,
  Megaphone,
  Globe,
  Server,
  type LucideIcon,
} from 'lucide-react';

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  bullets: string[];
  stack: string[];
  gradient: string;
};

/**
 * Client-facing wording: what you get — not jargon-first.
 */
export const services: Service[] = [
  {
    slug: 'custom-software',
    title: 'Custom Software',
    short:
      'Tailored desktop, enterprise and internal tools aligned with how your team works.',
    description:
      'When off-the-shelf products do not fit, we plan and ship software shaped around your processes — from dashboards and integrations to lasting line-of-business systems you can evolve with confidence.',
    icon: Layers,
    bullets: [
      'Requirements that match real workflows — not buzzwords.',
      'Iterative delivery so you see value early.',
      'Handover docs and clarity so your team stays in control.',
    ],
    stack: [
      'Django',
      'FastAPI',
      'Express',
      'PostgreSQL',
      'RDS',
      'REST APIs',
    ],
    gradient: 'from-cyan-500 via-teal-500 to-blue-700',
  },
  {
    slug: 'web-development',
    title: 'Web Development',
    short:
      'Fast, findable websites and web apps — from landing pages to business platforms.',
    description:
      'We help brands show up sharply online — customer-facing sites, dashboards and storefronts backed by layouts that adapt to phones and desktops, tuned so search engines understand what you offer.',
    icon: Code2,
    bullets: [
      'Clear structure and UX so visitors know what to do next.',
      'Performance so pages feel snappy.',
      'Ongoing refinement as your business grows.',
    ],
    stack: [
      'Next.js',
      'TypeScript',
      'React',
      'Angular',
      'Express',
      'Tailwind CSS',
    ],
    gradient: 'from-blue-600 via-indigo-500 to-cyan-500',
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    short:
      'iOS & Android apps with one focused codebase — from idea through store launch.',
    description:
      'Reach customers in their pockets with an app that matches your brand. We steer concept, UX, integrations and launches so submission and updates feel manageable — not chaotic.',
    icon: Smartphone,
    bullets: [
      'Roadmap from MVP to scale.',
      'Push, payments and integrations where you need them.',
      'Hands-on guidance for App Store and Play Store listings.',
    ],
    stack: ['Flutter', 'Dart', 'Firebase', 'Kotlin', 'Swift', 'Riverpod'],
    gradient: 'from-sky-500 via-cyan-500 to-teal-600',
  },
  {
    slug: 'shopify-ecommerce',
    title: 'Shopify E-commerce',
    short:
      'Beautiful stores that guide shoppers from browse to checkout with confidence.',
    description:
      'We design and evolve Shopify storefronts focused on conversions — clearer navigation, persuasive product detail, streamlined checkout flows and integrations with your fulfilment stack.',
    icon: ShoppingBag,
    bullets: [
      'Theme and layout tuned for sales — not fluff.',
      'Apps and integrations that behave predictably.',
      'Email journeys and promotions that reinforce repeat buyers.',
    ],
    stack: ['Shopify', 'Liquid', 'Remix', 'Klaviyo', 'Stripe', 'SEO'],
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
  },
  {
    slug: 'wordpress-ecommerce',
    title: 'WordPress & WooCommerce',
    short:
      'Editor-friendly websites and WooCommerce shops you can operate day to day.',
    description:
      'WordPress excels when marketers need agility. We build themes and stores that editing teams can honestly maintain — clean structure, security awareness and ecommerce flows that shoppers trust.',
    icon: Globe,
    bullets: [
      'Editor experience your team actually uses.',
      'WooCommerce experiences that feel storefront-grade.',
      'Care for speed, backups and upkeep.',
    ],
    stack: ['WordPress', 'WooCommerce', 'PHP', 'ACF', 'Elementor', 'MySQL'],
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
  },
  {
    slug: 'digital-marketing',
    title: 'Digital Marketing & SEO',
    short:
      'Visibility and qualified traffic — measurable, not mystical.',
    description:
      'We pair technical SEO fundamentals with pragmatic paid and content plans so you attract people who resemble your buyers — tracked in analytics you can read, not jargon buried in spreadsheets.',
    icon: Megaphone,
    bullets: [
      'Audits grounded in crawl data and searcher intent.',
      'Campaigns anchored to funnel stages you care about.',
      'Reporting you can reuse with leadership.',
    ],
    stack: ['GA4', 'GTM', 'Meta Ads', 'Google Ads', 'Klaviyo', 'Ahrefs'],
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
  },
  {
    slug: 'devops-deployment',
    title: 'DevOps & Cloud Deployment',
    short:
      'Reliable hosting, deployments and safeguards so releases feel boring — in the best way.',
    description:
      'Infrastructure should fade into the background. We help you settle on repeatable deploys, monitoring you notice when it matters and cloud posture that survives traffic spikes.',
    icon: Server,
    bullets: [
      'CI/CD pipelines your team trusts.',
      'SSL, CDN and observability stitched together sensibly.',
      'Cloud footprints on AWS and Azure tuned to workload.',
    ],
    stack: [
      'Docker',
      'GitHub Actions',
      'AWS',
      'Azure',
      'Cloudflare',
      'Kubernetes',
    ],
    gradient: 'from-slate-500 via-blue-700 to-indigo-600',
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

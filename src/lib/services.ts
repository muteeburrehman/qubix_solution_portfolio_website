import {
  Bot,
  Brain,
  Code2,
  Workflow,
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

export const services: Service[] = [
  {
    slug: 'ai-llm-development',
    title: 'AI & LLM Development',
    short:
      'Custom GPT, Claude & open-source LLM apps engineered for your domain.',
    description:
      'We design and ship production-grade LLM applications — RAG systems, AI agents, fine-tuned models and document intelligence pipelines — using OpenAI, Anthropic, Llama, Mistral and vector databases such as Pinecone, Weaviate and pgvector.',
    icon: Brain,
    bullets: [
      'Retrieval-Augmented Generation (RAG) on your private data',
      'Multi-agent systems with LangChain, LangGraph & CrewAI',
      'Fine-tuning and evaluation pipelines',
      'Voice & multimodal AI experiences',
    ],
    stack: ['OpenAI', 'Anthropic', 'LangChain', 'Pinecone', 'pgvector', 'Hugging Face'],
    gradient: 'from-violet-500 via-fuchsia-500 to-cyan-400',
  },
  {
    slug: 'ai-chatbots',
    title: 'AI Chatbots & Assistants',
    short:
      'Conversational AI for support, sales & internal knowledge — 24/7.',
    description:
      'Deploy intelligent chatbots and voice assistants on your website, WhatsApp, Slack or Messenger. Trained on your knowledge base, integrated with your CRM and capable of taking real actions through tool-calling.',
    icon: Bot,
    bullets: [
      'Website, WhatsApp, Telegram & Slack chatbots',
      'CRM, calendar & ticketing integrations',
      'Human-handover and analytics dashboards',
      'Multilingual support out of the box',
    ],
    stack: ['GPT-4o', 'Claude 3.5', 'Twilio', 'Voiceflow', 'Botpress'],
    gradient: 'from-cyan-400 via-sky-500 to-indigo-500',
  },
  {
    slug: 'ai-automation-n8n',
    title: 'AI Automation with n8n & Node.js',
    short:
      'Workflow automation that connects every tool in your business.',
    description:
      'We build robust automations using n8n, Make, Zapier and custom Node.js services — eliminating repetitive work across sales, marketing, finance and operations. Every workflow is observable, retry-safe and version-controlled.',
    icon: Workflow,
    bullets: [
      'Self-hosted n8n setups on your infrastructure',
      'Custom nodes & webhooks in Node.js / TypeScript',
      'AI-powered triggers, classifiers & enrichment',
      'CI/CD, monitoring and alerting included',
    ],
    stack: ['n8n', 'Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'],
    gradient: 'from-fuchsia-500 via-pink-500 to-rose-500',
  },
  {
    slug: 'web-development',
    title: 'Web Development (React & Angular)',
    short:
      'Blazing-fast, SEO-friendly web apps with React, Next.js & Angular.',
    description:
      'From landing pages to complex SaaS dashboards — we craft pixel-perfect, accessible and lightning-fast web applications with modern stacks, type safety and best-in-class developer experience.',
    icon: Code2,
    bullets: [
      'Next.js & React 19 SSR/SSG applications',
      'Angular enterprise dashboards & PWAs',
      'Design systems with Tailwind & Storybook',
      'Core Web Vitals tuned for SEO',
    ],
    stack: ['Next.js', 'React', 'Angular', 'TypeScript', 'Tailwind CSS', 'tRPC'],
    gradient: 'from-indigo-500 via-violet-500 to-purple-500',
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile App Development (Flutter)',
    short:
      'Cross-platform iOS & Android apps from a single Flutter codebase.',
    description:
      'Beautiful, native-quality mobile experiences built with Flutter and Dart — from MVP to App Store launch. We handle architecture, state management, offline support, push notifications and store submissions.',
    icon: Smartphone,
    bullets: [
      'Flutter for iOS, Android, Web & Desktop',
      'Firebase, Supabase & custom REST/GraphQL backends',
      'In-app purchases, push & analytics',
      'Play Store and App Store submission',
    ],
    stack: ['Flutter', 'Dart', 'Firebase', 'Supabase', 'Riverpod', 'Bloc'],
    gradient: 'from-sky-400 via-cyan-400 to-teal-400',
  },
  {
    slug: 'shopify-ecommerce',
    title: 'Shopify E-commerce',
    short:
      'High-converting Shopify stores, themes & headless storefronts.',
    description:
      'Custom Shopify themes, Liquid development, Shopify Hydrogen headless storefronts and conversion-rate optimization. We turn your store into a revenue engine.',
    icon: ShoppingBag,
    bullets: [
      'Custom Shopify themes & Liquid development',
      'Headless Shopify Hydrogen storefronts',
      'Checkout extensions & private apps',
      'CRO, analytics and Klaviyo email flows',
    ],
    stack: ['Shopify', 'Liquid', 'Hydrogen', 'Remix', 'Klaviyo'],
    gradient: 'from-emerald-400 via-teal-400 to-cyan-400',
  },
  {
    slug: 'wordpress-ecommerce',
    title: 'WordPress & WooCommerce',
    short:
      'Custom WordPress themes, plugins and WooCommerce stores.',
    description:
      'From content-heavy marketing sites to full-featured WooCommerce stores. We build secure, fast and easy-to-maintain WordPress experiences with custom themes, ACF blocks and plugin development.',
    icon: Globe,
    bullets: [
      'Custom WordPress themes & Gutenberg blocks',
      'WooCommerce stores with custom checkout',
      'Performance, security and SEO hardening',
      'Headless WordPress with Next.js',
    ],
    stack: ['WordPress', 'WooCommerce', 'PHP', 'ACF', 'Elementor'],
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
  },
  {
    slug: 'digital-marketing',
    title: 'Digital Marketing & SEO',
    short:
      'Performance marketing, SEO and content that compounds.',
    description:
      'Full-funnel digital marketing — technical SEO, paid ads, social, email and analytics. We don\'t just drive traffic, we drive qualified leads and measurable revenue.',
    icon: Megaphone,
    bullets: [
      'Technical & on-page SEO audits',
      'Google, Meta & LinkedIn Ads management',
      'Email & marketing automation',
      'GA4, GTM and conversion tracking',
    ],
    stack: ['GA4', 'GTM', 'Meta Ads', 'Google Ads', 'Klaviyo', 'Ahrefs'],
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
  },
  {
    slug: 'devops-deployment',
    title: 'DevOps & Cloud Deployment',
    short:
      'Docker, CI/CD and cloud infrastructure done right.',
    description:
      'We deploy and maintain applications on Hetzner, AWS, GCP and DigitalOcean — with Docker, Nginx, GitHub Actions and full observability. Reliable infrastructure that scales with you.',
    icon: Server,
    bullets: [
      'Hetzner, AWS, GCP & DigitalOcean setups',
      'Docker, Docker Compose & Kubernetes',
      'Nginx, SSL, CDN & monitoring',
      'CI/CD pipelines with GitHub Actions',
    ],
    stack: ['Docker', 'Nginx', 'GitHub Actions', 'Hetzner', 'AWS', 'Cloudflare'],
    gradient: 'from-slate-400 via-zinc-400 to-violet-400',
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

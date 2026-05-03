export const siteConfig = {
  name: 'Qubix Solutions',
  shortName: 'Qubix',
  domain: 'qubixsolution.com',
  url:
    process.env.NEXT_PUBLIC_SITE_URL || 'https://qubixsolution.com',
  email:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@qubixsolution.com',
  tagline: 'AI, Web, Backend, Mobile & E-commerce Engineering Studio',
  description:
    'Qubix Solutions builds production-grade AI agents, LLM apps, chatbots, n8n automations, scalable Python backends (FastAPI, Django, Django REST Framework, admin tooling), modern web platforms (React, Angular, Next.js), Flutter mobile apps, Shopify and WordPress e-commerce stores, and end-to-end digital marketing — engineered for growth.',
  keywords: [
    'AI development company',
    'LLM application development',
    'AI chatbot development',
    'n8n automation services',
    'Node.js development agency',
    'Python backend development',
    'FastAPI development agency',
    'Django development',
    'Django REST Framework development',
    'React.js development',
    'Angular development',
    'Flutter app development',
    'Shopify development agency',
    'WordPress e-commerce',
    'WooCommerce development',
    'digital marketing agency',
    'SEO services',
    'AI automation agency',
    'custom software development',
    'Qubix Solutions',
  ],
  social: {
    linkedin: 'https://www.linkedin.com/company/qubix-solutions',
    twitter: 'https://twitter.com/qubixsolution',
    github: 'https://github.com/qubix-solutions',
  },
  nav: [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Work', href: '/work' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
} as const;

export type NavItem = (typeof siteConfig.nav)[number];

export const siteConfig = {
  name: 'Qubix Solutions',
  shortName: 'Qubix',
  domain: 'qubixsolution.com',
  url:
    process.env.NEXT_PUBLIC_SITE_URL || 'https://qubixsolution.com',
  email:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@qubixsolution.com',
  whatsapp:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+923164720321',
  tagline:
    'Solutions for web, mobile, commerce & custom software.',
  description:
    'Qubix Solutions partners with ambitious teams — custom software, polished web platforms, flagship mobile apps, Shopify and WooCommerce storefronts and digital marketing grounded in measurable results.',
  keywords: [
    'custom software development',
    'web development agency',
    'mobile app development',
    'React development',
    'Angular development',
    'Django development',
    'FastAPI development',
    'Shopify developers',
    'WooCommerce development',
    'digital marketing agency',
    'SEO services',
    'Python backend development',
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

/** Opens WhatsApp chat for the configured number (wa.me link). */
export function whatsappHref(number: string = siteConfig.whatsapp): string {
  return `https://wa.me/${number.replace(/\D/g, '')}`;
}

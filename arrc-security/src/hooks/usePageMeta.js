import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { services } from '../data/services';
import { company } from '../data/company';
const pages = {
  '/': [
    'Security Beyond Guarding',
    'Integrated security, facility management and manpower solutions designed around your people, premises and operations.',
  ],
  '/about-us': [
    'About ARRC',
    'Meet ARRC Security Solutions Private Limited. ARC group heritage since 1991, with ARRC incorporated in June 2024.',
  ],
  '/services': [
    'Our Services',
    'Explore manned guarding, escort security, personal protection, event security, facilities, manpower and smart security services.',
  ],
  '/operations': [
    'Our Operations',
    'Understand our approach to site surveys, personnel selection, training, deployment, monitoring and continuous improvement.',
  ],
  '/technology': [
    'Security Technology',
    'Explore GPS monitoring, geo-fencing, QR patrol verification and digital attendance in a connected security operation.',
  ],
  '/industries': [
    'Industries We Serve',
    'Site-specific security and integrated services for corporate, residential, industrial, retail, educational and commercial environments.',
  ],
  '/why-choose-us': [
    'Why Choose ARRC',
    'A client-first approach supported by trained people, site-specific planning, active supervision and connected services.',
  ],
  '/contact-us': [
    'Contact Us',
    'Contact ARRC Security Solutions at our corporate office in Greenwood Plaza, Sec-45 Gurugram, or speak with our team about your requirements.',
  ],
  '/careers': [
    'Careers',
    'Explore direct and indirect staff opportunities with ARRC. Choose a role, share your experience and prepare your career application.',
  ],
  '/request-quote': [
    'Request a Quote',
    'Tell ARRC about your premises, service needs and operational priorities to discuss a tailored security and support proposal.',
  ],
  '/privacy-policy': [
    'Privacy Policy',
    'Draft privacy information explaining email enquiries, career applications, Google Maps and the use of contact details on this website.',
  ],
};
function meta(key, content, attribute = 'name') {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.content = content;
}
export default function usePageMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const service = services.find((item) => pathname === `/services/${item.slug}`);
    const [title, description] = service
      ? [service.title, service.description]
      : pages[pathname] || ['Page Not Found', 'Find your way back to ARRC Security Solutions.'];
    document.title = `${title} | ARRC Security Solutions`;
    meta('description', description);
    meta('og:title', document.title, 'property');
    meta('og:description', description, 'property');
    meta('og:type', 'website', 'property');
    const origin = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');
    const url = `${origin}${pathname}`;
    meta('og:url', url, 'property');
    meta('og:image', `${origin}/assets/images/corporate-building.jpg`, 'property');
    meta('robots', pages[pathname] || service ? 'index,follow' : 'noindex,follow');
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
    let structured = document.getElementById('company-structured-data');
    if (!structured) {
      structured = document.createElement('script');
      structured.type = 'application/ld+json';
      structured.id = 'company-structured-data';
      document.head.appendChild(structured);
    }
    structured.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: company.name,
      url: origin,
      logo: `${origin}/assets/logo/arrc-logo.png`,
      email: company.email,
      telephone: [company.salesTel, company.officeTel],
      foundingDate: '2024-06-25',
      address: {
        '@type': 'PostalAddress',
        streetAddress: company.offices[0].streetAddress,
        addressLocality: company.offices[0].name,
        addressRegion: company.offices[0].region,
        postalCode: company.offices[0].postalCode,
        addressCountry: 'IN',
      },
    });
  }, [pathname]);
}

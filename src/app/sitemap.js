export default function sitemap() {
  const baseUrl = 'https://dev.investateindia.brvteck.com';
  
  const routes = [
    '',
    '/builder',
    '/about-us',
    '/contact-us',
    '/properties',
    '/projects',
    '/terms',
    '/privacy',
    '/disclaimer',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}

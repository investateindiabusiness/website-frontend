export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/partner/dashboard/', '/builder/dashboard/', '/investor/dashboard/'],
    },
    sitemap: 'https://dev.investateindia.brvteck.com/sitemap.xml',
  };
}

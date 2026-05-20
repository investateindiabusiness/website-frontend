import './globals.css';
import { AuthProvider } from '@/hooks/AuthContext';
import { Toaster } from "@/components/ui/sonner";
import { Toaster as Toast } from "@/components/ui/toaster";

export const metadata = {
  metadataBase: new URL('https://dev.investateindia.brvteck.com'),
  title: 'Investate India | Bridging Global NRIs to Verified Indian Real Estate',
  description: 'Investate India is the trusted gateway bridging global NRIs to verified Indian real estate. Explore premium vetted properties with absolute transparency.',
  keywords: 'Investate India, Indian Real Estate, NRI Real Estate Investment, Verified Properties India, Buy Property in India, Premium Real Estate',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Investate India | Bridging Global NRIs to Verified Indian Real Estate',
    description: 'Investate India is the trusted gateway bridging global NRIs to verified Indian real estate. Explore premium vetted properties with absolute transparency.',
    url: 'https://dev.investateindia.brvteck.com',
    siteName: 'Investate India',
    images: [
      {
        url: '/logo-big.png',
        width: 800,
        height: 600,
        alt: 'Investate India Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Investate India | Bridging Global NRIs to Verified Indian Real Estate',
    description: 'Investate India is the trusted gateway bridging global NRIs to verified Indian real estate. Explore premium vetted properties with absolute transparency.',
    images: ['/logo-big.png'],
  },
};

const schemaJson = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Investate India",
  "url": "https://dev.investateindia.brvteck.com",
  "logo": "https://dev.investateindia.brvteck.com/logo-big.png",
  "image": "https://dev.investateindia.brvteck.com/logo-big.png",
  "description": "Connecting NRI investors to India's growth through verified real estate opportunities.",
  "email": "investateindia.business@gmail.com",
  "address": [
    {
      "@type": "PostalAddress",
      "addressLocality": "Hyderabad",
      "addressCountry": "IN"
    },
    {
      "@type": "PostalAddress",
      "addressLocality": "New York",
      "addressCountry": "US"
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logo-small-black.png" />
        <link rel="stylesheet" href="/theme.css" />
        <link rel="stylesheet" href="/index-page.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster />
          <Toast />
        </AuthProvider>
      </body>
    </html>
  );
}

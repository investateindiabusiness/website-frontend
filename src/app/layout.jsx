import './globals.css';
import { AuthProvider } from '@/hooks/AuthContext';
import { Toaster } from "@/components/ui/sonner";
import { Toaster as Toast } from "@/components/ui/toaster";
import Script from 'next/script';

export const metadata = {
  metadataBase: new URL('https://dev.investateindia.brvteck.com'),
  title: 'Global NRIs Investment in India Real Estate | Investate',
  description: 'Investate India is the trusted gateway for Global NRIs investment in India real estate. Explore premium vetted properties with absolute transparency.',
  keywords: 'Global NRIs investment in India real estate, Investate India, Indian Real Estate, NRI Real Estate Investment, Verified Properties India',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Global NRIs Investment in India Real Estate | Investate',
    description: 'Investate India is the trusted gateway for Global NRIs investment in India real estate. Explore premium vetted properties with absolute transparency.',
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
    title: 'Global NRIs Investment in India Real Estate | Investate',
    description: 'Investate India is the trusted gateway for Global NRIs investment in India real estate. Explore premium vetted properties with absolute transparency.',
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
      <body suppressHydrationWarning>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
        <AuthProvider>
          {children}
          <Toaster />
          <Toast />
        </AuthProvider>
      </body>
    </html>
  );
}

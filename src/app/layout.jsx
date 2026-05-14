import './globals.css';
import { AuthProvider } from '@/hooks/AuthContext';
import { Toaster } from "@/components/ui/sonner";
import { Toaster as Toast } from "@/components/ui/toaster";

export const metadata = {
  title: 'Investate India',
  description: 'Invest in premium real estate with Investate India',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logo-small-black.png" />
        <link rel="stylesheet" href="/theme.css" />
        <link rel="stylesheet" href="/index-page.css" />
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

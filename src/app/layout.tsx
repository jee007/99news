
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/contexts/language-context';
import { FilterProvider } from '@/contexts/filter-context';
import { BookmarkProvider } from '@/contexts/bookmark-context';
import { AppLayout } from '@/components/layout/app-layout';
import { CountryProvider } from '@/contexts/country-context';
import { AdSenseScript } from '@/components/adsense-script';
import { AdSettingsProvider } from '@/contexts/ad-settings-context';
import { GoogleAnalytics } from '@/components/google-analytics';

export const metadata: Metadata = {
  title: 'LatestNews9.com',
  description: 'Your multilingual news source, powered by AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AdSettingsProvider>
          <AdSenseScript />
          <GoogleAnalytics />
          <LanguageProvider>
            <FilterProvider>
              <CountryProvider>
                <BookmarkProvider>
                  <AppLayout>
                    {children}
                  </AppLayout>
                </BookmarkProvider>
              </CountryProvider>
            </FilterProvider>
          </LanguageProvider>
        </AdSettingsProvider>
        <Toaster />
      </body>
    </html>
  );
}

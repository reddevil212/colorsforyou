import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/header/page';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import AdSenseScript from '@/components/ads/AdSenseScript';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Colors For You - A simple color palette generator for your projects.',
  description: 'A simple color palette generator for your projects.',
  metadataBase: new URL('https://colorsforyou.web.app'),
  twitter:{
    card: 'summary_large_image',
    title: 'Colors For You',
    description: 'A simple color palette generator for your projects.',
    creator: '@sayanpal23861', 
    images: [
       'opengraph-image.png'
    ],
  },
  openGraph: {
    title: 'Colors For You',
    description: 'A simple color palette generator for your projects.',
    url: 'https://colorsforyou.web.app',
    siteName: 'Colors For You',
    images: ['opengraph-image.png' ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <AdSenseScript />
        </head>
      <body className={inter.className}>
        <ThemeProvider>
       
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
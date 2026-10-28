import type { Metadata } from 'next';
import './globals.css';
import Providers from '../components/Providers';

export const metadata: Metadata = {
  title: 'Kelme Spain | Official Store of Sportswear, Footwear, and Accessories',
  description:
    'Discover the official Kelme store. Buy futsal shoes, running shoes, football boots, sportswear, and official kits.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          rel="preload"
          href="/fonts/cabin-latin-700-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#000000]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

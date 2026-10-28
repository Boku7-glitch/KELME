import type { Metadata } from 'next';
import './globals.css';
import Providers from '../components/Providers';

export const metadata: Metadata = {
  title: 'KELME საქართველო — ოფიციალური ონლაინ მაღაზია | Sport Avenue',
  description:
    'KELME ფეხსაცმელი, საფეხბურთო ბუცები, სპორტული და ყოველდღიური სნიკერსები, საბავშვო მოდელები და გუნდური ფორმები საქართველოში. ს/ც ისთ ფოინთი, Sport Avenue.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka" className="h-full antialiased">
      <head>
        <link
          rel="preload"
          href="/fonts/noto-sans-georgian-georgian-700-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#111214]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import './globals.css';

import Background from '@/components/Background';
import { GoogleTagManager } from '@next/third-parties/google';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Chrome AI - Built-in Gemini Nano',
  description:
    'Run Chrome built-in large language model AI locally in your browser.',
  keywords: [
    'chrome',
    'built-in',
    'chrome built-in',
    'chrome built-in ai',
    'chrome gemini',
    'chrome ai',
    'chrome gemini nano',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleTagManager gtmId="G-MBR88GEWNE" />
        <Script
          id="gtag"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-MBR88GEWNE');`,
          }}
        />

        <Background>{children}</Background>
      </body>
    </html>
  );
}

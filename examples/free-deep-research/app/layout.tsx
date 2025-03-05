import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EdgeOne Pages AI: Free Deep Research',
  description: `A web-based efficient deep research tool that leverages EdgeOne Pages' edge AI capabilities to provide users with a free experience of DeepSeek R1. This tool implements smooth web search functionality through searxng, making the research process more convenient.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Free Developer Resources Mind Map | Tools, Services & Platforms',
  description:
    'Explore our comprehensive mind map of free developer resources, including SaaS, PaaS, IaaS, and more. Discover tools and services with free tiers for developers, startups, and indie hackers. Visualize and compare options for cloud computing, databases, APIs, testing, and development tools.',
  keywords: [
    'free developer resources',
    'developer tools',
    'free tier',
    'SaaS',
    'PaaS',
    'IaaS',
    'cloud services',
    'startups',
    'indie hackers',
    'mind map',
    'AWS alternatives',
    'open source',
    'web development',
    'mobile development',
    'DevOps',
    'database',
    'API',
    'testing tools',
    'productivity tools',
    'learning resources',
  ],
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

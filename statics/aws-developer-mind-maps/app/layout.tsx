import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AWS Mind Maps',
  description:
    'Comprehensive Visual Guide to AWS Engineering Skills Explore an extensive collection of mind maps designed to illustrate the essential skills and knowledge required for becoming a proficient AWS web engineer.',
  keywords: [
    'best mind maps aws',
    'aws mind maps of key services web developer',
    'aws mind maps',
    'aws mind maps for web developers',
    'aws mind maps for web engineers',
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

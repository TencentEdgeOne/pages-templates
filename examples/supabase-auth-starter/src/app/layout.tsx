import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Supabase Auth Starter | EdgeOne Makers',
  description: 'A Next.js app with Supabase authentication · Demo only · EdgeOne Makers',
  keywords: "EdgeOne Makers, Demo only",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';
import 'katex/dist/katex.css';
import './globals.css';

export const metadata = {
  title: "Fumadocs Template | EdgeOne Makers",
  description: "Demo only · EdgeOne Makers",
  keywords: "EdgeOne Makers, Demo only",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}

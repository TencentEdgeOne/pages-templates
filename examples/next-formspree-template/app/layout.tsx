import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Formspree Demo | EdgeOne Makers",
  description: "A simple contact form with Formspree integration · Demo only · EdgeOne Makers",
  keywords: "EdgeOne Makers, Demo only",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

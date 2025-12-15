import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Formspree Demo",
  description: "A simple contact form with Formspree integration",
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

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DeepSeek R1, enhanced with advanced network search capabilities. | EdgeOne Makers",
  description: "Experience the advanced capabilities of DeepSeek R1, seamlessly integrated with cutting-edge network search functionality. · Demo only · EdgeOne Makers",
  keywords: "EdgeOne Makers, Demo only",
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

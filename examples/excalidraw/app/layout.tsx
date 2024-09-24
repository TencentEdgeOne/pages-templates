import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Self-host Free Whiteboard - Excalidraw",
  description: "Excalidraw is a free, open-source virtual whiteboard for creating hand-drawn like diagrams, flowcharts, and sketches. Collaborate in real-time, export to various formats, and enhance your visual communication effortlessly.",
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

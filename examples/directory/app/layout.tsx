import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "独立开发者出海工具箱 | Indie Hacker Tools",
  description: "灵感、设计、开发、增长、变现、工具、资源等各类资源",
  keywords: ["独立开发者", "出海工具", "indie hacker", "tools"],
  authors: [{ name: "Indie Hacker Tools" }],
  creator: "Indie Hacker Tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

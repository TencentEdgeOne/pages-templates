import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "使用文档 | Raindrop.io 作为无头CMS",
  description: "如何使用 Raindrop.io 作为无头CMS来生成你自己的内容目录页面",
  keywords: ["Raindrop.io", "无头CMS", "文档", "教程"],
  authors: [{ name: "Indie Hacker Tools" }],
  creator: "Indie Hacker Tools",
};

export default function DocLayout({
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
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: '网页版 MCP 一句话生成一个全球加速站点',
    template: '%s | EdgeOne Pages MCP'
  },
  description: '基于 EdgeOne 边缘函数实现的 MCP Client 与 MCP Server。',
  keywords: 'EdgeOne Pages, MCP, 模型上下文协议, 边缘函数, 智能聊天, Next.js, Model Context Protocol, Edge Functions, AI Chat',
  authors: [{ name: 'EdgeOne Pages' }],
  creator: 'EdgeOne Pages',
  publisher: 'EdgeOne Pages',
  openGraph: {
    title: '网页版 MCP 一句话生成一个全球加速站点',
    description: '基于 EdgeOne 边缘函数实现的 MCP Client 与 MCP Server。',
    type: 'website',
    locale: 'zh_CN',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: '网页版 MCP 一句话生成一个全球加速站点',
    description: '基于 EdgeOne 边缘函数实现的 MCP Client 与 MCP Server。',
  },
  alternates: {
    languages: {
      'zh-CN': '/',
      'en': '/?lang=en',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

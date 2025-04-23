import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '网页版 MCP 一句话生成一个全球加速站点',
  description:
    '基于 EdgeOne 边缘函数实现的 MCP Client 与 MCP Server。',
  keywords: 'EdgeOne Pages, MCP, 模型上下文协议, 边缘函数, 智能聊天, Next.js',
  authors: [{ name: 'EdgeOne Pages' }],
  creator: 'EdgeOne Pages',
  publisher: 'EdgeOne Pages',
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

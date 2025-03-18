import React from 'react';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';

const CustomLink = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return <a {...props} target="_blank" rel="noopener noreferrer" />;
};

export default async function DocPage() {
  const markdownPath = path.join(process.cwd(), 'app/doc/doc.md');
  const markdownContent = await fs.readFile(markdownPath, 'utf8');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-indigo-600 dark:text-indigo-400"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-medium text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              导航站模板
            </span>
          </Link>

          <Link
            href="/"
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-md transition-all duration-300 shadow-sm hover:shadow-md"
          >
            返回首页
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="prose dark:prose-invert max-w-none">
              <MDXRemote 
                source={markdownContent} 
                components={{
                  a: CustomLink,
                }}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-8">
        <div className="container mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
          <p>使用 Raindrop.io 作为无头CMS构建 | Indie Hacker Tools</p>
        </div>
      </footer>
    </div>
  );
}

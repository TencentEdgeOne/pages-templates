import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeStringify from 'rehype-stringify';
import { Metadata } from 'next';
import Link from 'next/link';

interface BlogPostProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'content/blog');
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => ({
      slug: fileName.replace(/\.md$/, ''),
    }));
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  return {
    title: `${post.title} | 独立开发者出海工具箱`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

async function getPost(slug: string) {
  const fullPath = path.join(process.cwd(), 'content/blog', `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeExternalLinks, {
      target: '_blank',
      rel: ['noopener', 'noreferrer']
    })
    .use(rehypeStringify)
    .process(content);

  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    title: data.title,
    date: data.date,
    description: data.description,
    tags: data.tags || [],
  };
}

export default async function BlogPost({ params }: BlogPostProps) {
  const post = await getPost(params.slug);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            返回博客列表
          </Link>
        </div>
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            {post.title}
          </h1>
          <div className="mb-4">
            <time className="text-slate-500 dark:text-slate-400">
              {new Date(post.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div 
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </div>
  );
} 
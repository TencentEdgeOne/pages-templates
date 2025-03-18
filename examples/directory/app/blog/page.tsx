import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
}

export async function generateMetadata() {
  return {
    title: '博客文章 | 独立开发者出海工具箱',
    description: '独立开发者出海工具箱的博客文章，分享出海经验、工具使用和成功案例。',
  };
}

function getBlogPosts(): BlogPost[] {
  const postsDirectory = path.join(process.cwd(), 'content/blog');
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
        tags: data.tags || [],
      };
    })
    .sort((a, b) => (new Date(b.date) as any) - (new Date(a.date) as any));

  return posts;
}

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/"
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
            返回首页
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-8 text-center text-slate-900 dark:text-white">
          博客文章
        </h1>
        
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-slate-200/50 dark:border-slate-700/50"
            >
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
              </Link>
              <div className="mb-4">
                <time className="text-sm text-slate-500 dark:text-slate-400">
                  {new Date(post.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {post.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
} 
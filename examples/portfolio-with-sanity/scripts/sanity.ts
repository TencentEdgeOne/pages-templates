import { createClient } from 'next-sanity'
import { loadEnv } from './env'

// 加载环境变量
loadEnv()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

console.log('Sanity 环境变量:', {
  projectId,
  dataset,
  NODE_ENV: process.env.NODE_ENV
});

let client: ReturnType<typeof createClient> | null = null;

if (projectId && dataset) {
  console.log('Sanity 配置:', {
    projectId,
    dataset,
    apiVersion: '2024-03-01',
    useCdn: false, // 本地开发时禁用 CDN
    perspective: 'published'
  });

  client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-03-01',
    useCdn: false, // 本地开发时禁用 CDN 
  });
}

// 定义项目类型
export interface Project {
  _id: string;
  title: string;
  category: string;
  publishedAt: string;
  image: string;
  slug: string;
  height: string;
  description: string;
  client?: string;
  role?: string;
  technologies?: string[];
}

export interface ProjectDetail extends Project {
  mainImage: string;
}

export async function getProjects(): Promise<Project[]> {
  if (!client) {
    console.log('未设置 Sanity 环境变量，返回空数据');
    return [];
  }

  try {
    const query = `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      category,
      publishedAt,
      "image": image.asset->url,
      "slug": slug.current,
      height,
      description,
      client,
      role,
      technologies
    }`;
    
    const result = await client.fetch(query);
    return result as Project[];
  } catch (error) {
    console.error('从 Sanity 获取数据时出错:', error);
    throw error;
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  if (!client) {
    console.log('未设置 Sanity 环境变量，返回空数据');
    return null;
  }

  try {
    const query = `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      category,
      publishedAt,
      description,
      "image": image.asset->url,
      "mainImage": image.asset->url,
      "slug": slug.current,
      height,
      client,
      role,
      technologies
    }`;
    
    const result = await client.fetch(query, { slug });
    if (!result) {
      console.log(`未找到 slug 为 "${slug}" 的项目`);
      return null;
    }
    
    return result as ProjectDetail;
  } catch (error) {
    console.error('从 Sanity 获取项目详情时出错:', (error as {message: string}).message);
    throw error;
  }
} 
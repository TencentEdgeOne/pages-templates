import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

if (!projectId || !dataset) {
  throw new Error('未设置 Sanity 环境变量。请确保设置了 NEXT_PUBLIC_SANITY_PROJECT_ID 和 NEXT_PUBLIC_SANITY_DATASET');
}

console.log('Sanity 配置:', {
  projectId,
  dataset,
  apiVersion: '2024-03-01',
  useCdn: false, // 本地开发时禁用 CDN
  perspective: 'published'
});

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-03-01',
  useCdn: false, // 本地开发时禁用 CDN 
})

// 定义项目类型
export interface Project {
  _id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  slug: string;
  height: string;
  description: string;
  bgColor?: string;
}

export interface ProjectDetail extends Project {
  publishedAt: string;
  mainImage: string;
  client?: string;
  role?: string;
  technologies?: string[];
}

export async function getProjects(): Promise<Project[]> {
  try {
    const query = `*[_type == "post"] | order(order asc) {
      _id,
      title,
      category,
      "image": image.asset->url, 
      "slug": slug.current,
      height,
      description,
      bgColor,
      client,
      role,
      technologies,
      publishedAt
    }`;
    
    const result = await client.fetch(query);
    return result as Project[];
  } catch (error) {
    console.error('从 Sanity 获取数据时出错:', error);
    throw error;
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail> {
  try {
    const query = `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      category,
      description,
      publishedAt,
      "mainImage": image.asset->url,
      client,
      role,
      technologies,
      sections
    }`;
    
    const result = await client.fetch(query, { slug });
    console.log("Sanity 查询结果:", result);
    if (!result) {
      throw new Error(`未找到 slug 为 "${slug}" 的项目`);
    }
    
    return result as ProjectDetail;
  } catch (error) {
    console.error('从 Sanity 获取项目详情时出错:', (error as {message: string}).message);
    throw error;
  }
} 
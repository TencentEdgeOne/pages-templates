declare module "@sanity/block-content-to-react";

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
import { createClient } from 'next-sanity'
import { loadEnv } from './env'

// Load environment variables
loadEnv()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

console.log('Sanity environment variables:', {
  projectId,
  dataset,
  NODE_ENV: process.env.NODE_ENV
});

let client: ReturnType<typeof createClient> | null = null;

if (projectId && dataset) {
  console.log('Sanity configuration:', {
    projectId,
    dataset,
    apiVersion: '2024-03-01',
    useCdn: false, // Disable CDN for local development
    perspective: 'published'
  });

  client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-03-01',
    useCdn: false, // Disable CDN for local development
  });
}

// Define project type
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
    console.log('Sanity environment variables not set, returning empty data');
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
    console.error('Error fetching data from Sanity:', error);
    throw error;
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  if (!client) {
    console.log('Sanity environment variables not set, returning empty data');
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
      console.log(`Project with slug "${slug}" not found`);
      return null;
    }
    
    return result as ProjectDetail;
  } catch (error) {
    console.error('Error fetching project details from Sanity:', (error as {message: string}).message);
    throw error;
  }
} 
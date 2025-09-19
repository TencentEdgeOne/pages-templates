import { createClient } from 'next-sanity'
import { getAllProjects, getProjectBySlug } from '@/lib/markdown';



const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';


let client: ReturnType<typeof createClient> | null = null;

if (projectId && dataset) {
  client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-03-01',
    useCdn: true
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

export async function getAllProjectDatas(): Promise<Project[]> {
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

export async function getProjectDataBySlug(slug: string): Promise<ProjectDetail | null> {
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

export function hasSanityClient(): boolean {
  return !!client;
}

export function fetchAllProjects() {
  if(hasSanityClient()){
    return getAllProjectDatas()
  }
  return getAllProjects();
}

export function fetchProjectBySlug(slug: string) {
  if(hasSanityClient()){
    return getProjectDataBySlug(slug)
  }
  return getProjectBySlug(slug);
}
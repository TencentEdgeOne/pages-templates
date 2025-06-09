import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import matter from 'gray-matter'
import type { Project, ProjectDetail } from './types'

const CONTENT_DIR = path.join(process.cwd(), 'src/content/projects')

export async function getAllProjects(): Promise<Project[]> {
  try {
    const files = await fs.readdir(CONTENT_DIR)
    const projects = await Promise.all(
      files
        .filter(file => file.endsWith('.md'))
        .map(async file => {
          const content = await fs.readFile(path.join(CONTENT_DIR, file), 'utf-8')
          const { data } = matter(content)
          return {
            ...data,
            _id: data.slug,
            publishedAt: new Date(data.publishedAt).toLocaleDateString(),
          } as Project
        })
    )
    return projects
  } catch (error) {
    console.error('Error reading projects:', error)
    return []
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.md`)
    const content = await fs.readFile(filePath, 'utf-8')
    const { data, content: description } = matter(content)
    
    return {
      ...data,
      _id: data.slug,
      mainImage: data.image,
      description: description.trim(),
      publishedAt: new Date(data.publishedAt).toLocaleDateString(),
    } as ProjectDetail
  } catch (error) {
    console.error(`Error reading project ${slug}:`, error)
    return null
  }
} 
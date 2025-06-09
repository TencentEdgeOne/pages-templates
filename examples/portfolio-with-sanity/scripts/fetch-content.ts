import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { getProjects } from './sanity'
import { loadEnv } from './env'

const CONTENT_DIR = path.join(process.cwd(), 'src/content/projects')

// Debug environment variables
console.log('Current working directory:', process.cwd())
console.log('Environment variables:', {
  NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
})

async function fetchAndSaveContent() {
  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.log('NEXT_PUBLIC_SANITY_PROJECT_ID not set, skipping markdown fetch')
    return
  }

  console.log('fetching content')
  // Ensure directory exists
  await fs.mkdir(CONTENT_DIR, { recursive: true })

  try {
    // Get all projects
    const projects = await getProjects()

    // Save each project as a markdown file
    for (const project of projects) {
      const {
        title,
        category,
        description,
        publishedAt,
        image,
        client,
        role,
        technologies,
        height,
        slug,
      } = project

      // Create frontmatter and content
      const fileContent = `---
title: ${JSON.stringify(title)}
category: ${JSON.stringify(category)}
description: ${JSON.stringify(description || '')}
publishedAt: ${publishedAt}
image: ${image}
client: ${JSON.stringify(client || '')}
role: ${JSON.stringify(role || '')}
technologies: ${JSON.stringify(technologies || [])}
height: ${JSON.stringify(height || 'sm')}
slug: ${slug}
---

${description || ''}
`

      // Save file
      const filePath = path.join(CONTENT_DIR, `${slug}.md`)
      await fs.writeFile(filePath, fileContent, 'utf-8')
      console.log(`Saved: ${slug}.md`)
    }

    console.log('Content successfully fetched and saved!')
  } catch (error) {
    console.error('Error fetching and saving content:', error)
    process.exit(1)
  }
}

// Execute script
loadEnv()
fetchAndSaveContent() 
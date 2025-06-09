import { config } from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'

export function loadEnv() {
  if (process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_DELIVERY_TOKEN) {
    return true;
  }
  console.log('Loading environment variables');
  const envFiles = ['.env', '.env.local']
  const cwd = process.cwd()

  for (const file of envFiles) {
    const envPath = path.join(cwd, file)
    
    try {
      if (fs.existsSync(envPath)) {
        console.log(`Loading environment variables from ${file}`)
        config({ path: envPath })
        
        if (process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_DELIVERY_TOKEN) {
          console.log(`Successfully loaded environment variables from ${file}`)
          return true
        }
      }
    } catch (error) {
      console.warn(`Error loading ${file}:`, error)
    }
  }

  console.warn('Failed to load necessary environment variables from any environment file')
  return false
} 
import { DirectoryItemProps } from './directory-data';
import { fetchRaindrops, mapRaindropsToDirectoryItems, extractAllTags } from './raindrop-api';
import fs from 'fs';
import path from 'path';

export interface StaticDirectoryData {
  directoryItems: DirectoryItemProps[];
  allTags: string[];
}

export async function getStaticDirectoryData(): Promise<StaticDirectoryData> {
  try {
    // You can specify a collection ID here if needed
    const collectionId = 0; // 0 means all bookmarks
    const response = await fetchRaindrops(collectionId);

    // Write response items to a local file for easier inspection
    if (process.env.NODE_ENV === 'development') {
      const debugFilePath = path.join(process.cwd(), 'debug-raindrop-items.json');
      fs.writeFileSync(debugFilePath, JSON.stringify(response.items, null, 2), 'utf8');
      console.log(`Debug data written to: ${debugFilePath}`);
    }
    
    // Map Raindrop items to DirectoryItemProps
    const items = mapRaindropsToDirectoryItems(response.items);
    
    // Extract all tags
    const tags = extractAllTags(items);
    
    return {
      directoryItems: items,
      allTags: tags
    };
  } catch (err) {
    console.error('Error fetching data from Raindrop.io:', err);
    throw new Error('Failed to fetch data from Raindrop.io. Please check your API token and try again.');
  }
} 
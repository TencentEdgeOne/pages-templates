import { DirectoryItemProps } from './directory-data';

// Raindrop API response types
export interface RaindropItem {
  _id: string;
  title: string;
  excerpt: string;
  link: string;
  tags: string[];
  cover: string;
  created: string;
  type: string;
  domain: string;
  note: string;
  media: {link: string, type: string}[];
}

export interface RaindropResponse {
  items: RaindropItem[];
  count: number;
  collectionId: number;
}

// Function to fetch bookmarks from Raindrop.io API
export async function fetchRaindrops(collectionId = 0): Promise<RaindropResponse> {
  // The API token should be stored in environment variables
  // Using process.env instead of process.env.NEXT_PUBLIC_ for server-side rendering
  const token = process.env.RAINDROP_API_TOKEN;
  
  if (!token) {
    throw new Error('Raindrop API token is not defined');
  }

  const perPage = 50; // Maximum items per page allowed by Raindrop API
  let allItems: RaindropItem[] = [];
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`https://api.raindrop.io/rest/v1/raindrops/${collectionId}?page=${page}&perPage=${perPage}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch raindrops: ${response.statusText}`);
    }

    const data = await response.json();
    allItems = [...allItems, ...data.items];
    
    // Check if there are more items to fetch based on total count
    console.log(`Fetched ${data.items.length} items, total: ${data.count}`);
    hasMore = allItems.length < data.count;
    page++;
  }

  return {
    items: allItems,
    count: allItems.length,
    collectionId
  };
}

// Function to convert Raindrop items to DirectoryItemProps
export function mapRaindropsToDirectoryItems(raindrops: RaindropItem[]): DirectoryItemProps[] {
  return raindrops.map(item => ({
    id: item._id,
    title: item.title,
    note: item.note,
    tags: item.tags,
    excerpt: item.excerpt,
    link: item.link,
    cover: item.cover,
    created: item.created,
    media: item.media,
  }));
}

// Function to get all unique tags from raindrops
export function extractAllTags(items: DirectoryItemProps[]): string[] {
  return Array.from(new Set(items.flatMap(item => item.tags))).sort();
}

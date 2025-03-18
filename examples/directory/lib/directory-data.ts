export interface DirectoryItemProps {
  id: string;
  title: string;
  tags: string[];
  excerpt: string;
  link: string;
  cover: string;
  created: string;
  media: {link: string, type: string}[];
  note: string;
}

// These will be populated from the API
export const directoryItems: DirectoryItemProps[] = [];
export const categories: string[] = [];
export const allTags: string[] = [];
export const allTechnologies: string[] = []; 
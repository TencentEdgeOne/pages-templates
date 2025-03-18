/**
 * Performs a fuzzy search on a string
 * @param text The text to search in
 * @param query The query to search for
 * @returns A score between 0 and 1, where 1 is a perfect match
 */
export function fuzzySearch(text: string, query: string): number {
  if (!text || !query) return 0;
  
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  // Exact match gets highest score
  if (lowerText.includes(lowerQuery)) {
    // Prioritize matches at the beginning of the text or at word boundaries
    if (lowerText.startsWith(lowerQuery)) {
      return 1;
    }
    
    // Check if the match is at a word boundary
    const index = lowerText.indexOf(lowerQuery);
    if (index > 0 && (lowerText[index - 1] === ' ' || lowerText[index - 1] === '-' || lowerText[index - 1] === '_')) {
      return 0.9;
    }
    
    return 0.8;
  }
  
  // Check for partial matches (all characters in order but with other characters in between)
  let textIndex = 0;
  let queryIndex = 0;
  let matchCount = 0;
  
  while (textIndex < lowerText.length && queryIndex < lowerQuery.length) {
    if (lowerText[textIndex] === lowerQuery[queryIndex]) {
      matchCount++;
      queryIndex++;
    }
    textIndex++;
  }
  
  // Calculate a score based on how many characters matched and how close they are
  if (matchCount === lowerQuery.length) {
    return 0.5 + (matchCount / lowerText.length) * 0.3;
  }
  
  // Calculate a partial match score
  return (matchCount / lowerQuery.length) * 0.4;
}

/**
 * Extracts the domain from a URL
 * @param url The URL to extract the domain from
 * @returns The domain or the original URL if it's not a valid URL
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return url;
  }
} 
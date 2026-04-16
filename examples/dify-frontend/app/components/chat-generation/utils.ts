import { validate as validateUuid } from 'uuid'

/**
 * Strips common Markdown syntax from a string so that it can be fed to
 * a Text-to-Speech engine without reading out raw formatting characters.
 *
 * Handled patterns (in order):
 *  1. Fenced code blocks  ``` … ```
 *  2. Inline code         `…`
 *  3. ATX headings        ## …
 *  4. Bold / italic / strikethrough  **…** / _…_ / ~~…~~
 *  5. Links and images    [label](url) / ![alt](url)
 *  6. List markers and blockquotes   - / * / + / >
 *  7. Collapse consecutive blank lines to a single space
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, '$1')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s*[-*+>]\s/gm, '')
    .replace(/\n{2,}/g, ' ')
    .trim()
}

/**
 * Returns the given string if it looks like a valid Dify UUID, otherwise
 * returns `undefined`.  Used to prevent local placeholder IDs (e.g.
 * `"assistant-1714900000"`) from being forwarded to the Dify API as a
 * `message_id`, which would cause a 400 validation error.
 */
export function toDifyMessageId(id: string): string | undefined {
  return validateUuid(id) ? id : undefined
}

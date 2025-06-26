import { z } from 'zod';

// Type definitions
interface SearchResult {
  title: string;
  url: string;
  content: string;
}

interface ProcessedContent {
  content: string;
  searchResults?: SearchResult[];
}

// Schema definitions
const messageSchema = z
  .object({
    messages: z.array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string(),
      })
    ),
    network: z.boolean().optional(),
    model: z.string().optional(),
  })
  .passthrough();

/**
 * Search the web using SearXNG
 */
async function searxngSearch(
  query: string,
  SEARXNG_URL = 'https://proxy.edgeone.app/search'
): Promise<SearchResult[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      engines: 'bing',
    });

    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      Origin: 'https://proxy.edgeone.app',
    };

    const response = await fetch(`${SEARXNG_URL}?${params}`, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Search failed: ${errorText}`);
    }

    const data = await response.json();
    return data?.results || [];
  } catch (error) {
    console.error('SearXNG search error:', error);
    return [];
  }
}

/**
 * Format search results into a readable context string
 */
function formatSearchResults(results: SearchResult[]): string {
  return results
    .map((result, i) => {
      const index = i + 1;
      const title = result.title || 'No title';
      const url = result.url || 'No URL';
      const snippet = result.content || 'No snippet';

      return `
[webpage ${index} begin]
Title: ${title}
Url: ${url}
Snippet: ${snippet}
[webpage ${index} end]
`;
    })
    .join('\n\n');
}

/**
 * Process user input, optionally augmenting with web search results
 */
async function getContent(
  input: string,
  withNetwork: boolean
): Promise<ProcessedContent> {
  if (!withNetwork) {
    return { content: input };
  }

  try {
    const searchResults = await searxngSearch(input);

    if (!searchResults.length) {
      return { content: '' };
    }

    const context = formatSearchResults(searchResults);
    const contentWithNetworkSearch = `
# The following content is search results based on the user's message:
${context}
In the search results I provided, each result is in the format of [webpage X begin]...[webpage X end], where X represents the numerical index of each article.
When answering, please note the following points:
- Today is ${new Date().toLocaleDateString('zh-CN')}.
- Not all content in the search results is closely related to the user's question. You need to evaluate and filter the search results based on the question.
- For listing-type questions (such as listing all flight information), try to limit your answer to no more than 10 points, and tell the user they can check the search sources for complete information. Prioritize providing complete and most relevant list items; unless necessary, don't proactively mention content not provided in search results.
- For creative questions (such as writing essays), you need to interpret and summarize the user's requirements, choose an appropriate format, fully utilize the search results and extract important information to generate an answer that meets user requirements with intellectual depth, creativity and professionalism. Your creative content should be as lengthy as possible, providing multiple perspectives for each point based on your interpretation of user intent, ensuring information-rich and detailed explanations.
- If the answer is lengthy, please structure it and summarize by paragraphs. If point-by-point answers are needed, try to limit it to 5 points and merge related content.
- For objective Q&A, if the answer is very brief, you may add one or two sentences of related information to enrich the content.
- You need to choose an appropriate and aesthetically pleasing format for your answer based on user requirements and answer content, ensuring strong readability.
- Your answer should synthesize information from multiple relevant webpages, not repeatedly referencing a single webpage.
- Unless requested by the user, your response language should match the language of the user's question.
# User message:
${input}
    `;

    return {
      content: contentWithNetworkSearch,
      searchResults,
    };
  } catch (err) {
    console.error('Content processing failed:', err);
    return { content: input };
  }
}

/**
 * Format search results for response headers
 */
function formatResultsForHeader(results: SearchResult[]): string {
  return JSON.stringify(
    results.map((item) => ({
      url: item.url,
      title: encodeURIComponent(item.title),
    }))
  );
}

/**
 * Create standardized response with CORS headers
 */
function createResponse(body: any, status = 200, extraHeaders = {}): Response {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...extraHeaders,
  };

  return new Response(JSON.stringify(body), { status, headers });
}

/**
 * Handle OPTIONS request for CORS preflight
 */
function handleOptionsRequest(): Response {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function onRequest({ request, env }: any) {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return handleOptionsRequest();
  }

  // Remove encoding header to avoid compression issues
  request.headers.delete('accept-encoding');

  try {
    const json = await request.clone().json();
    const parseResult = messageSchema.safeParse(json);

    if (!parseResult.success) {
      return createResponse({ error: parseResult.error.message });
    }

    const { messages, network, model } = parseResult.data;

    const currentInput = messages[messages.length - 1]?.content;

    if (!currentInput) {
      return createResponse({ error: 'No input message found' });
    }

    const { content, searchResults = [] } = await getContent(
      currentInput,
      !!network
    );

    if (!content) {
      return createResponse({ error: 'No Search Results' });
    }

    // Update the last message with processed content
    const processedMessages = [...messages];
    processedMessages[processedMessages.length - 1] = {
      role: 'user',
      content,
    };

    try {
      // Define allowed models
      const allowedModels = [
        '@tx/deepseek-ai/deepseek-r1-distill-qwen-32b',
        '@tx/deepseek-ai/deepseek-r1-0528',
        '@tx/deepseek-ai/deepseek-v3-0324',
      ];

      // Use the model parameter, fallback to default if not provided
      const selectedModel =
        model || '@tx/deepseek-ai/deepseek-r1-distill-qwen-32b';

      // Validate the model
      if (!allowedModels.includes(selectedModel)) {
        return createResponse({
          error: `Invalid model: ${selectedModel}. Allowed models: ${allowedModels.join(
            ', '
          )}`,
        });
      }

      // @ts-ignore-next-line
      const aiStream = await AI.chatCompletions({
        model: selectedModel,
        messages: processedMessages,
        stream: true,
      });

      return new Response(aiStream, {
        headers: {
          results: formatResultsForHeader(searchResults),
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    } catch (error: any) {
      return createResponse({ error: error.message });
    }
  } catch (error: any) {
    return createResponse({
      error: 'Request processing failed',
      details: error.message,
    });
  }
}

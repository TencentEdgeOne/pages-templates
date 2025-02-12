import { z } from 'zod';

const ERRORS = {
  ENV_CONFIG_MISSING:
    'Environment configuration is missing. Please set up the necessary environment variables in your EdgeOne Pages project settings.',
  SEARCH_WEB_FAILED: 'Search Web failed.',
  LLM_FAILED: 'An error occurred while calling the BASE_URL.',
};

export async function searxngSearch(SEARXNG_URL: string, query: string) {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    engines: 'bing',
  });

  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  };

  const response = await fetch(`${SEARXNG_URL}?${params}`, { headers });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const data = await response.json();

  return data?.results || [];
}

function formatSearchResults(
  results: { title: string; url: string; content: string }[]
) {
  const formatted = [];
  for (const result of results) {
    const title = result.title || 'No title';
    const url = result.url || 'No URL';
    const snippet = result.content || 'No snippet';
    formatted.push(`Title: ${title}
Url: ${url}
Snippet: ${snippet}`);
  }
  return formatted.join('\n\n');
}

export async function onRequest({ request, params, env }: any) {
  request.headers.delete('accept-encoding');

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const { BASE_URL, API_KEY, MODEL, SEARXNG_URL } = env;

  if (!BASE_URL || !API_KEY || !MODEL || !SEARXNG_URL) {
    return new Response(ERRORS.ENV_CONFIG_MISSING, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const json = await request.clone().json();
  const result = z
    .object({
      messages: z.array(
        z.object({
          role: z.enum(['user', 'assistant', 'system']),
          content: z.string(),
        })
      ),
    })
    .passthrough()
    .safeParse(json);

  if (!result.success) {
    return new Response(result.error.message, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const { messages } = result.data;
  const currentInput = messages[0]?.content;

  let searchResults;

  try {
    searchResults = await searxngSearch(SEARXNG_URL, currentInput);
  } catch (err: any) {
    console.error('Search Web failed: ', err);
    return new Response(ERRORS.SEARCH_WEB_FAILED, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const context = formatSearchResults(searchResults);

  console.log(context);

  const contentWithNetworkSearch = `Based on the following search results, please answer the question:

    ${context}
    
    Question: "${currentInput}"
    
    Please respond in the same language as the question (e.g., if asked in English, respond in English; if asked in another language, respond in that language).`;

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: contentWithNetworkSearch,
          },
        ],
        stream: true,
      }),
    });

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error('LLM error: ', error.message);
    return new Response(ERRORS.LLM_FAILED, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

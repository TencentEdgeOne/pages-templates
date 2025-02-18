import { z } from 'zod';

export async function searxngSearch(
  query: string,
  SEARXNG_URL = 'https://searxng.edgeone.app/search'
) {
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

export async function getContent(input: string, withNetwork: boolean) {
  if (withNetwork) {
    let searchResults;

    try {
      searchResults = await searxngSearch(input);
    } catch (err: any) {
      console.error('Search Web failed: ', err);
      return input;
    }

    const context = formatSearchResults(searchResults);

    const contentWithNetworkSearch = `Based on the following search results, please answer the question:
  
      ${context}
      
      Question: "${input}"
      
      Please respond in the same language as the question (e.g., if asked in English, respond in English; if asked in another language, respond in that language).`;

    return contentWithNetworkSearch;
  }

  return input;
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

  const json = await request.clone().json();
  const result = z
    .object({
      messages: z.array(
        z.object({
          role: z.enum(['user', 'assistant', 'system']),
          content: z.string(),
        })
      ),
      network: z.boolean().optional(),
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

  const { messages, network } = result.data;
  const currentInput = messages[messages.length - 1]?.content;

  const content = await getContent(currentInput, !!network);

  messages[messages.length - 1] = {
    role: 'user',
    content,
  };

  try {
    // @ts-ignore-next-line
    const res = await AI.run(
      '@tx/deepseek-ai/deepseek-r1-distill-qwen-32b/v1/chat/completions',
      JSON.stringify({
        model: 'deepseek-r1-distill-qwen-32b',
        stream: true,
        messages: messages,
      })
    );

    return new Response(res, {
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
    return new Response('error: ' + error.message, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

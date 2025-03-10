import { z } from 'zod';

export async function searxngSearch(
  query: string,
  SEARXNG_URL = 'https://proxy.edgeone.app/search'
) {
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
    throw new Error(errorText);
  }

  const data = await response.json();

  return data?.results || [];
}

export async function getContent(
  input: string,
  withNetwork: boolean
): Promise<{
  content: string;
  searchResults?: { title: string; url: string; content: string }[];
}> {
  if (withNetwork) {
    let searchResults;

    try {
      searchResults = await searxngSearch(input);
    } catch (err: any) {
      console.error('Search Web failed: ', err);
      return {
        content: input,
      };
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
  }

  return {
    content: input,
  };
}

function formatSearchResults(
  results: { title: string; url: string; content: string }[]
) {
  const formatted = [];
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const index = i + 1;
    const title = result.title || 'No title';
    const url = result.url || 'No URL';
    const snippet = result.content || 'No snippet';
    formatted.push(`
[webpage ${index} begin]
Title: ${title}
Url: ${url}
Snippet: ${snippet}
[webpage ${index} end]
`);
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
    return new Response(JSON.stringify({ error: result.error.message }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const { messages, network } = result.data;
  const currentInput = messages[messages.length - 1]?.content;

  const { content, searchResults = [] } = await getContent(
    currentInput,
    !!network
  );

  messages[messages.length - 1] = {
    role: 'user',
    content,
  };

  try {
    // @ts-ignore-next-line
    const res = await AI.chatCompletions({
      model: '@tx/deepseek-ai/deepseek-r1-distill-qwen-32b',
      messages: messages,
      stream: true,
    });

    return new Response(res, {
      headers: {
        results: JSON.stringify(
          searchResults.map((item) => {
            return {
              url: item.url,
              title: encodeURIComponent(item.title),
            };
          })
        ),
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

interface SearchResult {
  query: string;
  results: {
    url: string;
    title: string;
    content: string;
  }[];
}

interface TavilyApiResponse {
  results: Array<{
    url: string;
    title: string;
    content: string;
    [key: string]: any;
  }>;
}

interface RequestEnvironment {
  TAVILY_KEY: string;
  [key: string]: any;
}

interface RequestParams {
  request: Request;
  params: any;
  env: RequestEnvironment;
}

/**
 * Creates a JSON response with CORS headers
 */
function createJsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

/**
 * Searches for information using the Tavily API
 */
export async function tavilySearch(
  key: string,
  q: string
): Promise<SearchResult> {
  const url = 'https://api.tavily.com/search';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        query: q,
        time_range: 'year',
        include_answer: 'advanced',
      }),
    });

    if (!res.ok) {
      throw new Error(`Tavily API error: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as TavilyApiResponse;

    return {
      query: q,
      results: json.results.map((item) => ({
        url: item.url,
        title: item.title,
        content: item.content,
      })),
    };
  } catch (error) {
    console.error('Tavily search error:', error);
    throw error;
  }
}

/**
 * Handles the incoming request for search functionality
 */
export async function onRequest({
  request,
  params,
  env,
}: RequestParams): Promise<Response> {
  // Validate request method
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { TAVILY_KEY } = env;

  // Extract and validate query parameter
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  if (!q) {
    return new Response('Missing query parameter', { status: 400 });
  }

  try {
    // Perform search
    const data = await tavilySearch(TAVILY_KEY, q);
    return createJsonResponse(data);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Unknown error occurred';
    return createJsonResponse({ error: errorMessage });
  }
}

export function createResponse(data: { [key: string]: string }, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

type RequestContext = {
  request: Request;
};

export async function onRequest({ request }: RequestContext) {
  if (request.method !== 'GET') {
    return createResponse({ error: 'Method not allowed' }, 405);
  }

  const url = new URL(request.url);
  const key = url.pathname.split('/').pop();

  if (!key) {
    return createResponse({ error: 'Key is required' }, 400);
  }

  try {
    // @ts-ignore
    const value = await my_kv.get(key);

    if (!value) {
      return createResponse({ error: 'Resource not found' }, 404);
    }

    // Process and return response
    return handleValueResponse(value);
  } catch (error) {
    console.error(`Error retrieving key ${key}:`, error);
    return createResponse({ error: 'Internal server error' }, 500);
  }
}

/**
 * Process value and return appropriate response
 */
function handleValueResponse(value: string) {
  // Check if this is HTML content using a single regex
  const isHtml = /<html\b[^>]*>|<!DOCTYPE html>/i.test(value);

  if (isHtml) {
    // Extract HTML content if it's wrapped in markdown code blocks
    let htmlContent = value;
    if (htmlContent.includes('```html')) {
      htmlContent = htmlContent.replace(/```html\n|\n```/g, '');
    }

    return new Response(htmlContent, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // Default JSON response for non-HTML content
  return createResponse({ value });
}

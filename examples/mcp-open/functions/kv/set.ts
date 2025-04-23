import { nanoid } from 'nanoid';

export function validateHtml(value: string): {
  isValid: boolean;
  error?: string;
} {
  // Check if string contains basic HTML structure
  const hasHtmlTag = /<html[^>]*>/i.test(value);
  const hasBodyTag = /<body[^>]*>/i.test(value);

  if (!hasHtmlTag) {
    return {
      isValid: false,
      error: 'Value must contain an HTML tag.',
    };
  }

  if (!hasBodyTag) {
    return {
      isValid: false,
      error: 'Value must contain a BODY tag.',
    };
  }

  return {
    isValid: true,
  };
}

interface ResponseData {
  [key: string]: string;
}

export function createResponse(data: ResponseData, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

interface RequestContext {
  request: Request;
}

export async function onRequest({
  request,
}: RequestContext): Promise<Response> {
  if (request.method !== 'POST') {
    return createResponse({ error: 'Method not allowed' }, 405);
  }

  const url = new URL(request.url);
  const baseUrl = url.protocol + '//' + url.host;

  try {
    // Parse request body
    const body = await request.clone().json();
    const { value } = body;

    // Validate input
    if (typeof value !== 'string') {
      return createResponse({ error: 'Value must be a string' }, 400);
    }

    // Validate HTML
    const validationResult = validateHtml(value);
    if (!validationResult.isValid) {
      return createResponse(
        {
          error: validationResult.error || 'Invalid HTML document',
        },
        400
      );
    }

    // Generate unique key and store in KV
    const key = nanoid();

    // @ts-ignore -  KV binding
    await my_kv.put(key, value);

    const shareUrl = `${baseUrl}/share/${key}`;

    // Return successful response
    return createResponse({
      key,
      url: shareUrl,
    });
  } catch (err: any) {
    console.error('Error processing request:', err);
    return createResponse(
      {
        error: 'Create failed',
        message: err.message || 'Unknown error',
      },
      500
    );
  }
}

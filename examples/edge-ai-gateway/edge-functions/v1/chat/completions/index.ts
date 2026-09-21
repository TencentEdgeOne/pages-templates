import type { EdgeFunctionContext } from '@edgeone/types';
import { z } from 'zod';

const ERRORS = {
  ENV_CONFIG_MISSING:
    'Environment configuration is missing. Please set up the necessary environment variables in your EdgeOne Pages project settings.',
  LLM_FAILED: 'An error occurred while calling the BASE_URL.',
};

export async function onRequest({ request, env }: EdgeFunctionContext) {
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

  const { BASE_URL, API_KEY, MODEL } = env;

  if (!BASE_URL || !API_KEY || !MODEL) {
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

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
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

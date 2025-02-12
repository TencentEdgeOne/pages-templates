import { z } from 'zod';
import { searxngSearch } from '../v1/chat/completions/index';

export async function onRequest({ request, params, env }: any) {
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

  const { SEARXNG_URL } = env;

  const json = await request.clone().json();
  const result = z
    .object({
      q: z.string(),
    })
    .safeParse(json);

  if (!result.success) {
    return new Response(result.error.message, { status: 422 });
  }

  const { q } = result.data;

  let data;
  try {
    data = await searxngSearch(SEARXNG_URL, q);
  } catch (err: any) {
    return new Response(err.message, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

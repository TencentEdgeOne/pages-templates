import { z } from 'zod';

const chatCompletionSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
    })
  ),
  temperature: z.number().optional().default(0.6),
});

function createResponse(body: any, status = 200, additionalHeaders = {}) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...additionalHeaders,
    },
  });
}

function handleCorsPreflightRequest() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

function createStreamResponse(stream: any) {
  return new Response(stream, {
    headers: {
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream;',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function onRequest({ request }: any) {
  request.headers.delete('accept-encoding');

  if (request.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  try {
    const json = await request.clone().json();
    const result = chatCompletionSchema.safeParse(json);

    if (!result.success) {
      return createResponse(JSON.stringify({ error: result.error.message }));
    }

    const { messages, temperature } = result.data;

    // @ts-ignore-next-line
    const res = await AI.chatCompletions({
      model: '@tx/deepseek-ai/deepseek-r1-distill-qwen-32b',
      messages: messages,
      stream: true,
      temperature,
    });

    return createStreamResponse(res);
  } catch (error: any) {
    return createResponse(JSON.stringify({ error: error.message }));
  }
}

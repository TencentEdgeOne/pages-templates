export async function onRequest({ request }: { request: any }) {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const url = new URL(request.url);
  const baseUrl = url.protocol + '//' + url.host;

  return new Response(JSON.stringify({ baseUrl: `${baseUrl}/kv/set` }));
}

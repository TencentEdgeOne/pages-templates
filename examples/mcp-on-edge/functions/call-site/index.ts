import type { CloudFunctionContext } from '@edgeone/types';

export const onRequest = async ({ request }: CloudFunctionContext) => {
  const res = await fetch(`https://mcp.edgeone.site/kv/set`, {
    method: 'POST',
    body: JSON.stringify({
      value: '<html><body><h1>Hello, World!</h1></body></html>',
    }),
  });
  const data = await res.json();
  return new Response(JSON.stringify(data));
};

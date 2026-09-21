import type { CloudFunctionContext } from '@edgeone/types';

export function onRequest({ request }: CloudFunctionContext) {
  const eo = request!.eo;

  return new Response(
    JSON.stringify({
      eo,
    }),
    {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
 
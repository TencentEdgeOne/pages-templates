/** @param {import('@edgeone/types').CloudFunctionContext} context */
export function onRequest(context) {
  const json = JSON.stringify({
    "code": 0,
    "message": "Hello World"
  });
  return new Response(json, {
    headers: {
      'content-type': 'application/json',
      'x-edgefunctions': 'Welcome to use EdgeOne Pages Functions.',
    },
  });
}


export function onRequest({ request }: { request: any }) {
  const geo = request.eo.geo;
  const res = JSON.stringify({
    geo: geo,
  });

  return new Response(res, {
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

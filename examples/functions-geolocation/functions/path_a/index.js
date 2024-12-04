export function onRequest({request}) {
  return new Response(JSON.stringify({ path: 'path_a' }), {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'x-edgefunctions-test': 'Welcome to use Pages Functions.',
    },
  });
}

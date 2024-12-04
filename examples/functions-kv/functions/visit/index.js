export async function onRequest({ request, params, env }) {
  try {
    const visitCount = await my_kv.get('visitCount');
    let visitCountInt = Number(visitCount);
    visitCountInt += 1;
    await my_kv.put('visitCount', visitCountInt.toString());

    const res = JSON.stringify({
      visitCount: visitCountInt,
    });

    return new Response(res, {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        error:
          'KV storage is not configured. Please set up KV in your EdgeOne Pages Project.',
      }),
      {
        headers: {
          'content-type': 'application/json; charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

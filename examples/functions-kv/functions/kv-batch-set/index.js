export async function onRequest({ request, params, env }) {
  try {
    const prefix = 'batch_test_';
    const tasks = [];

    for (let i = 1; i <= 100; i += 1) {
      const key = `${prefix}${i}`;
      const value = `value_${i}`;
      tasks.push(my_kv.put(key, value));
    }

    await Promise.all(tasks);

    return new Response(
      JSON.stringify({
        message: 'Batch set completed',
        count: 100,
        prefix,
      }),
      {
        headers: {
          'content-type': 'application/json; charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err.message || JSON.stringify(err),
      }),
      {
        headers: {
          'content-type': 'application/json; charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
          error: '1',
        },
      }
    );
  }
}

export async function onRequest({ request, params, env }) {
  try {
    const allItems = [];
    let cursor = '';
    let complete = false;

    while (!complete) {
      const page = await my_kv.list({
        prefix: '',
        cursor,
        limit: 10,
      });

      const keys = Array.isArray(page?.keys) ? page.keys : [];
      const values = await Promise.all(
        keys.map(async (item) => {
          const value = await my_kv.get(item.key);
          return {
            key: item.key,
            value,
            ttl: item.ttl,
            meta: item.meta,
          };
        })
      );
      allItems.push(...values);

      if (keys.length > 0) {
        cursor = keys[keys.length - 1].key || '';
      }

      complete = Boolean(page?.complete) || keys.length === 0;
    }

    return new Response(
      JSON.stringify({
        items: allItems,
        count: allItems.length,
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

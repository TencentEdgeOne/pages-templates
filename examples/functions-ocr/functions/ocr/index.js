export async function onRequest({ request, params, env }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  try {
    const body = await request.clone().json();

    const image = body.image;

    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Convert the provided image into Markdown format.
Ensure that all content from the page is included, such as headers, footers, subtexts, images (with alt text if possible), tables, and any other elements.
Requirements:
- Output Only Markdown: Return solely the Markdown content without any additional explanations or comments.
- No Delimiters: Do not use code fences or delimiters like \`\`\`markdown.
- Complete Content: Do not omit any part of the page, including headers, footers, and subtext.
- Return the table content in the form of a markdown table.
`,
          },
          {
            type: 'image_url',
            image_url: {
              url: image,
            },
          },
        ],
      },
    ];

    const res = await fetch(env.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: env.TOKEN,
      },
      eo: {
        timeoutSetting: {
          connectTimeout: 60000,
          readTimeout: 60000,
          writeTimeout: 60000,
        },
      },
      body: JSON.stringify({
        model: 'hunyuan-vision',
        messages: messages,
      }),
    });

    const resJSON = await res.json();

    return new Response(JSON.stringify(resJSON.data), {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

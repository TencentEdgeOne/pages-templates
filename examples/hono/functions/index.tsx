import { Context, Hono } from 'hono';
// import { ipRestriction } from 'hono/ip-restriction';
import type { KVNamespace } from './env';
import { book, upload, ssr } from './routers/index';

declare global {
  let my_kv: KVNamespace;
}

const app = new Hono().basePath('/');

// Register route modules
app.route('/book', book);
app.route('/upload', upload);
app.route('/ssr', ssr);

// IP restriction middleware (optional)
// app.use(
//   '*',
//   ipRestriction(
//     c => ({
//       remote: {
//         // @ts-expect-error
//         address: c.req.raw.eo.clientIp,
//         addressType:
//           String(
//             // @ts-expect-error
//             c.req.raw.eo.clientIp
//           ).indexOf('::') === -1
//             ? 'IPv4'
//             : 'IPv6'
//       }
//     }),
//     {
//       denyList: [],
//       allowList: [ '127.0.0.1', '::1']
//     }
//   )
// );

const notFound = async (c: Context) => {
  return c.html(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Page Not Found</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            text-align: center;
          }
          .container {
            max-width: 600px;
            margin: 100px auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #e74c3c;
            font-size: 72px;
            margin: 0;
          }
          h2 {
            color: #333;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
          <p><a href="/">← Go back to home</a></p>
        </div>
      </body>
    </html>
  `,
    404
  );
};

// Fallback to static directory
app.notFound(async (c) => {
  const url = new URL(c.req.url);

  if (url.pathname === '/') {
    url.pathname = '/index.html';
  }

  try {
    const res = await fetch(url.toString(), {
      headers: c.req.header()
    });

    if (res.ok) {
      const contentType = res.headers.get('Content-Type')!;
      const body = await res.arrayBuffer();

      return new Response(body, {
        status: res.status,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
  } catch (error) {
    return notFound(c);
  }
  return notFound(c);
});

app.onError((err, c) => {
  return c.html(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>500 - Internal Server Error</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            text-align: center;
          }
          .container {
            max-width: 600px;
            margin: 100px auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #e74c3c;
            font-size: 72px;
            margin: 0;
          }
          h2 {
            color: #333;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>500</h1>
          <h2>Internal Server Error</h2>
          <p>Something went wrong on our server. Please try again later.</p>
          <p>Error: ${err.message}</p>
          <p><a href="/">← Go back to home</a></p>
        </div>
      </body>
    </html>
  `,
    500
  );
});

// EdgeOne Functions export
export function onRequest(context: {
  request: Request;
  params: Record<string, string>;
  env: Record<string, any>;
}): Response | Promise<Response> {
  return app.fetch(context.request, context.env);
}

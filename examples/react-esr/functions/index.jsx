import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../src/App';

export async function onRequest({ request, params, env }) {
  const body = renderToString(<App />);
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>React SSR with EdgeOne Pages</title>
      <style>
        html, body {
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <div id="root">${body}</div>
      <script src="/bundle.js"></script>
    </body>
  </html>
`;
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}

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
      <title>React SSR with EdgeOne Pages | EdgeOne Makers</title>
      <link rel="icon" href="/favicon.ico" type="image/x-icon">
      <style>
        html, body {
          margin: 0;
          padding: 0;
        }
      </style>
        <meta name="description" content="Demo only · EdgeOne Makers" />
    <meta name="keywords" content="EdgeOne Makers, Demo only" />
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

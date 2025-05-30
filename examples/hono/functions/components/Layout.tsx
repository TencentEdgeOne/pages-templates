import { html } from 'hono/html';

export interface SiteData {
  title: string;
  children?: any;
}

export const Layout = (props: SiteData) =>
  html`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${props.title}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
              sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
            border-bottom: 2px solid #007acc;
            padding-bottom: 10px;
          }
          .nav-links {
            margin: 20px 0;
          }
          .nav-links ul {
            list-style: none;
            padding: 0;
          }
          .nav-links li {
            margin: 10px 0;
          }
          .nav-links a {
            color: #007acc;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 4px;
            transition: background-color 0.2s;
          }
          .nav-links a:hover {
            background-color: #f0f8ff;
          }
          .back-link {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
          .back-link a {
            color: #666;
            text-decoration: none;
          }
          .back-link a:hover {
            color: #007acc;
          }
          pre {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 16px;
            overflow-x: auto;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
            line-height: 1.4;
          }
          code {
            background-color: #f8f9fa;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9em;
          }
          pre code {
            background-color: transparent;
            padding: 0;
          }
          h2 {
            color: #2c3e50;
            margin-top: 32px;
            margin-bottom: 16px;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
          }
          h3 {
            color: #34495e;
            margin-top: 24px;
            margin-bottom: 12px;
          }
          ul li {
            margin-bottom: 8px;
          }
          strong {
            color: #2c3e50;
          }
          .highlight-box {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
          }
          .highlight-box h3 {
            margin-top: 0;
            color: #495057;
          }
        </style>
      </head>
      <body>
        <div class="container">${props.children}</div>
      </body>
    </html>
  `;

export const Content = (props: { siteData: SiteData; name: string; children?: any }) => (
  <Layout {...props.siteData}>
    <h1>{props.name}</h1>
    {props.children || (
      <p>
        Welcome to our Hono application. This page was rendered server-side with
        JSX.
      </p>
    )}
  </Layout>
);

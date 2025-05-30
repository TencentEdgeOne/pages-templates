import { Hono } from 'hono';
import { Layout, Content } from '../components/Layout';

const pages = new Hono();

// Home page
pages.get('/', async (c) => {
  // Can get geolocation and client IP information
  // console.log(c.req.raw.eo.geo);
  // console.log(c.req.raw.eo.clientIp);

  const props = {
    name: 'EdgeOne Pages Hono Application',
    siteData: {
      title: 'EdgeOne Pages Hono Application - Modern Web Application Framework',
    },
    children: (
      <div>
        <p>This is a modern Web application built on the <a href="https://hono.dev/" target="_blank" rel="noopener">Hono</a> framework, deployed on the EdgeOne Functions platform.</p>
        
        <h2>🚀 Project Features</h2>
        <ul>
          <li><strong>Modular Route Design</strong> - Clear route organization structure</li>
          <li><strong>Server-Side Rendering</strong> - Page rendering using JSX and HTML templates</li>
          <li><strong>File Upload</strong> - File upload functionality support</li>
          <li><strong>Book Management</strong> - Example CRUD operations</li>
          <li><strong>Error Handling</strong> - Beautiful 404 and 500 error pages</li>
          <li><strong>TypeScript Support</strong> - Complete type definitions</li>
        </ul>

        <h2>🛣️ Route Overview</h2>
        <div className="nav-links">
          <h3>Page Routes</h3>
          <ul>
            <li><a href="/">Home - Application introduction and navigation</a></li>
            <li><a href="/demo">Dynamic page example (/demo)</a></li>
          </ul>

          <h3>Book Management</h3>
          <ul>
            <li><a href="/book">📚 Book list page</a></li>
            <li><a href="/book/1">📖 Book details example</a></li>
          </ul>

          <h3>API Endpoints</h3>
          <ul>
            <li><strong>POST /book</strong> - Create new book</li>
            <li><strong>POST /upload</strong> - File upload</li>
          </ul>
        </div>

        <h2>📖 Quick API Usage</h2>
        <h3>Create Book</h3>
        <pre><code>{`curl -X POST ${c.req.url.replace(/\/$/, '')}/book \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "New Book Title",
    "author": "Author Name"
  }'`}</code></pre>

        <h3>File Upload</h3>
        <pre><code>{`curl -X POST ${c.req.url.replace(/\/$/, '')}/upload \\
  -F "file=@example.txt"`}</code></pre>

        <h2>🔧 Technology Stack</h2>
        <ul>
          <li><strong>Hono</strong> - Lightweight Web framework</li>
          <li><strong>EdgeOne Functions</strong> - Edge computing platform</li>
          <li><strong>TypeScript</strong> - Type safety</li>
          <li><strong>JSX</strong> - Server-side rendering</li>
        </ul>

        <h2>🌐 Deployment Information</h2>
        <p>This application is deployed on the EdgeOne Functions platform, supporting:</p>
        <ul>
          <li>Global edge node acceleration</li>
          <li>Auto-scaling</li>
          <li>CORS cross-origin support</li>
          <li>KV storage persistence</li>
        </ul>

        <div className="highlight-box">
          <h3>📝 Development Notes</h3>
          <p>This is a complete example application demonstrating various features and best practices of the Hono framework on EdgeOne Functions.</p>
          <p>The project structure is clear, code is well organized, and suitable as a starting template for other projects.</p>
        </div>
      </div>
    ),
  };

  return c.html(<Content {...props} />);
});

// Dynamic page route
pages.get('/:name', (c) => {
  const { name } = c.req.param();
  const props = {
    name: name,
    siteData: {
      title: `Hello ${name} - JSX Sample`,
    },
  };
  return c.html(<Content {...props} />);
});

export default pages;

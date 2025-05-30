import { Hono } from 'hono';
import { Content } from '../components/Layout';

const book = new Hono();

// Get all books list
book.get('/', (c) => {
  const props = {
    name: '📚 Book Library',
    siteData: {
      title: 'Books - Hono App',
    },
    children: (
      <div>
        <p>Browse our collection of books</p>
        <div style="margin: 20px 0;">
          <div style="padding: 15px; margin: 10px 0; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #007acc;">
            <h3><a href="/book/1">The Art of Programming</a></h3>
            <p>A comprehensive guide to software development</p>
          </div>
          <div style="padding: 15px; margin: 10px 0; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #007acc;">
            <h3><a href="/book/2">JavaScript: The Good Parts</a></h3>
            <p>Essential JavaScript programming techniques</p>
          </div>
          <div style="padding: 15px; margin: 10px 0; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #007acc;">
            <h3><a href="/book/3">Clean Code</a></h3>
            <p>Writing maintainable and readable code</p>
          </div>
        </div>
        <div class="back-link">
          <a href="/">← Back to home</a>
        </div>
      </div>
    ),
  };

  return c.html(Content(props));
});

// Get specific book
book.get('/:id', (c) => {
  const id = c.req.param('id');
  const books: Record<string, any> = {
    '1': { title: 'The Art of Programming', author: 'John Doe', description: 'A comprehensive guide to software development principles and practices.' },
    '2': { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', description: 'Essential JavaScript programming techniques and best practices.' },
    '3': { title: 'Clean Code', author: 'Robert C. Martin', description: 'A handbook of agile software craftsmanship.' }
  };

  const bookData = books[id];
  if (!bookData) {
    const props = {
      name: 'Book Not Found',
      siteData: {
        title: 'Book Not Found',
      },
      children: (
        <div>
          <p>The book with ID {id} was not found.</p>
          <div class="back-link">
            <a href="/book">← Back to books</a>
          </div>
        </div>
      ),
    };
    return c.html(Content(props), 404);
  }

  const props = {
    name: `📖 ${bookData.title}`,
    siteData: {
      title: `${bookData.title} - Book Details`,
    },
    children: (
      <div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Author:</strong> {bookData.author}</p>
          <p><strong>Book ID:</strong> {id}</p>
          <p><strong>Description:</strong> {bookData.description}</p>
        </div>
        <div class="back-link">
          <a href="/book">← Back to books</a>
        </div>
      </div>
    ),
  };

  return c.html(Content(props));
});

// Create new book (API endpoint)
book.post('/', async (c) => {
  const body = await c.req.json();
  return c.json({
    success: true,
    message: 'Book created successfully',
    book: {
      id: Math.random().toString(36).substr(2, 9),
      title: body.title || 'Untitled',
      author: body.author || 'Unknown',
      createdAt: new Date().toISOString()
    }
  });
});

export default book; 
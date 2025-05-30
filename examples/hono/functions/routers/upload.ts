import { Hono } from 'hono';

const upload = new Hono();

// File upload endpoint
upload.post('/', async (c) => {
  const body = await c.req.parseBody();
  console.log(body['file'], 'File uploaded');

  return c.json({
    success: true,
    message: 'File uploaded successfully',
    fileName: body['file']
  });
});

export default upload; 
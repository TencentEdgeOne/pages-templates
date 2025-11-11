/**
 * EdgeOne Edge Function - Root Path Handler
 * 
 * This function handles requests to the root path (/) by fetching 
 * and returning the index.html file. All other paths are handled 
 * by [[id]].js.
 */

export async function onRequest(context) {
  const { request } = context;
  
  try {
    const url = new URL(request.url);
    const indexUrl = new URL('/index.html', url.origin);
    const response = await fetch(indexUrl.toString());
    
    if (response.ok) {
      const newHeaders = new Headers(response.headers);
      
      // Set custom headers for debugging
      newHeaders.set('x-edge-function', 'root');
      newHeaders.set('x-powered-by', 'EdgeOne Pages');
      newHeaders.set('x-matched-path', url.pathname);
      newHeaders.set('x-ef-handler', 'index.js');
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
    }
    
    return new Response('Index file not found', { 
      status: 404,
      headers: {
        'content-type': 'text/plain',
        'x-edge-function': 'root'
      }
    });
    
  } catch (error) {
    console.error('Error in root function:', error);
    return new Response('Internal Server Error', { 
      status: 500,
      headers: {
        'content-type': 'text/plain',
        'x-edge-function': 'root'
      }
    });
  }
}
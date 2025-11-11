/**
 * EdgeOne Edge Function - Catch-all Route Handler (SPA Mode)
 * 
 * This function handles all non-root paths (e.g., /about, /user/123).
 * It supports client-side routing for Single Page Applications.
 * 
 * Important notes:
 * - [[id]] does NOT match the root path (/), which is handled by index.js
 * - Static assets (.js, .css, .png, etc.) pass through to the Pages platform
 * - Only HTML routes (without file extensions) return index.html
 */

export async function onRequest(context) {
  const { request } = context;
  
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // List of static file extensions to pass through
    const staticExtensions = [
      '.js', '.css', '.json', '.xml', '.txt',
      '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp',
      '.woff', '.woff2', '.ttf', '.eot', '.otf',
      '.mp4', '.webm', '.mp3', '.wav',
      '.pdf', '.zip', '.map'
    ];
    
    // Check if the path has a static file extension
    const hasExtension = staticExtensions.some(ext => pathname.toLowerCase().endsWith(ext));
    
    // Pass through static assets to EdgeOne Pages platform
    if (hasExtension) {
      return fetch(request);
    }
    
    // For HTML routes (SPA routes), return index.html
    const indexUrl = new URL('/index.html', url.origin);
    const response = await fetch(indexUrl.toString());
    
    if (response.ok) {
      const newHeaders = new Headers(response.headers);
      
      // Set custom headers for debugging
      newHeaders.set('x-edge-function', 'catch-all');
      newHeaders.set('x-powered-by', 'EdgeOne Pages');
      newHeaders.set('x-matched-path', pathname);
      newHeaders.set('x-ef-handler', '[[id]].js');
      newHeaders.set('x-ef-route-type', 'spa');
      
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
        'x-edge-function': 'catch-all'
      }
    });
    
  } catch (error) {
    console.error('Error in catch-all function:', error);
    return new Response('Internal Server Error', { 
      status: 500,
      headers: {
        'content-type': 'text/plain',
        'x-edge-function': 'catch-all'
      }
    });
  }
}
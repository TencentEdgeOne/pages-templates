import { cookies } from 'next/headers';

/**
 * Get user authentication state in SSR by internally calling the /api/user endpoint
 * This approach maintains SSR advantages while reusing API authentication logic
 */
export async function getServerAuthStateViaAPI() {
  const defaultResponse = { user: null, loggedIn: false };
  
  try {
    // Get cookies from current request
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    
    let domain = process.env.NEXT_PUBLIC_SITE_URL;
    if(domain.endsWith('/')) domain = domain.slice(0, -1);
    // Build internal API request URL
    const baseUrl = domain || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/auth/user`;
    const formData = new FormData();
    
    // Make internal API request
    const response = await fetch(apiUrl, {
      method: 'POST',
      credentials: 'include',
      body: formData,
      headers: {
        'Cookie': cookieHeader
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        user: data.user,
        loggedIn: !!data.user,
      };
    } else if (response.status === 401) {
      // User not logged in
      return defaultResponse;
    } else {
      console.warn(`API call failed: ${response.status} ${response.statusText}`);
      return defaultResponse;
    }
  } catch (error) {
    if (error.name === 'TimeoutError') {
      console.warn('SSR API call timeout, using default state');
    } else {
      console.warn('SSR API call failed:', error.message);
    }
    return defaultResponse;
  }
}

/**
 * Safe SSR authentication state retrieval function
 * Never throws errors, ensures pages can render normally
 */
export async function getSafeServerAuthStateViaAPI() {
  try {
    return await getServerAuthStateViaAPI();
  } catch (error) {
    console.error('SSR authentication state retrieval failed, using fallback state:', error);
    return { user: null, loggedIn: false };
  }
}
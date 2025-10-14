import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSupabaseClient } from '../../libs/supabase.js';

/**
 * Authentication logic function
 * @param {Object} options - Configuration options
 * @param {number} options.timeout - Timeout duration (milliseconds)
 * @param {boolean} options.throwOnError - Whether to throw errors
 * @returns {Promise<{user: Object|null, loggedIn: boolean, error?: string}>}
 */
async function getAuthState(options = {}) {
  const { 
    timeout = 10000, 
    throwOnError = false,
    data = {}
  } = options;

  const fallbackResponse = {
    user: null,
    loggedIn: false
  };

  try {
    // Get cookies with UTF-8 validation
    const cookieStore = await cookies();
    let accessToken = cookieStore.get('access_token')?.value;
    let refreshToken = cookieStore.get('refresh_token')?.value;
    let userId = cookieStore.get('user_id')?.value;
    
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!accessToken) {
      const error = 'No access token found';
      if (throwOnError) {
        // Create a simple error object to avoid displaying stack trace
        const authError = new Error(error);
        authError.name = 'AuthError';
        authError.isAuthError = true;
        throw authError;
      }
      return { ...fallbackResponse, error };
    }

    // Check environment variables
    if (!supabaseUrl || !supabaseKey) {
      const error = 'Supabase environment variables not found';
      if (throwOnError) {
        throw new Error(error);
      }
      return { ...fallbackResponse, error };
    }

    // Create Supabase client
    let supabase;
    try {
      supabase = createSupabaseClient(supabaseUrl, supabaseKey, accessToken);
    } catch (clientError) {
      const error = `Failed to create Supabase client: ${clientError.message}`;
      if (throwOnError) {
        throw new Error(error);
      }
      return { ...fallbackResponse, error };
    }
    // Set session (with timeout protection and UTF-8 error handling)
    try {
      // Additional validation before setting session
      if (!accessToken || !refreshToken) {
        const error = 'Missing required tokens for session';
        if (throwOnError) {
          throw new Error(error);
        }
        return { ...fallbackResponse, error };
      }

      const sessionPromise = supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session timeout')), timeout)
      );
      
      const { data, error: sessionError } = await Promise.race([sessionPromise, timeoutPromise]);
      
      if (sessionError) {
        let error = `Session error: ${sessionError.message}`;
        
        // Handle specific UTF-8 related errors
        if (sessionError.message.includes('Invalid UTF-8') || 
            sessionError.message.includes('invalid character') ||
            sessionError.message.includes('malformed')) {
          error = 'Session data corrupted - please sign in again';
          console.log('UTF-8 session error detected, tokens may be corrupted');
        }
        
        if (throwOnError) {
          throw new Error(error);
        }
        return { ...fallbackResponse, error };
      }
      
    } catch (sessionError) {
      let error = `Session operation failed: ${sessionError.message}`;
      
      // Handle UTF-8 specific errors
      if (sessionError.message.includes('Invalid UTF-8') || 
          sessionError.message.includes('invalid character') ||
          sessionError.message.includes('malformed')) {
        error = 'Session data corrupted - please sign in again';
        console.log('UTF-8 session operation error detected');
      }
      
      if (throwOnError) {
        throw new Error(error);
      }
      return { ...fallbackResponse, error };
    }

    // Get user information (with timeout protection)
    try {
      const userPromise = supabase.auth.getUser();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('User fetch timeout')), timeout)
      );
      
      const { data: { user }, error: userError } = await Promise.race([userPromise, timeoutPromise]);

      if (userError || !user) {
        const error = `User error: ${userError?.message || 'User not found'}`;
        if (throwOnError) {
          throw new Error(error);
        }
        return { ...fallbackResponse, error };
      }

      return {
        user: {
          id: user.id,
          email: user.email || '',
          created_at: user.created_at || new Date().toISOString()
        },
        loggedIn: true
      };
    } catch (userError) {
      const error = `User fetch failed: ${userError.message}`;
      if (throwOnError) {
        throw new Error(error);
      }
      return { ...fallbackResponse, error };
    }

  } catch (error) {
    const errorMsg = `Auth error: ${error.message}`;
    if (throwOnError) {
      throw new Error(errorMsg);
    }
    return { ...fallbackResponse, error: errorMsg };
  }
}

/**
 * API-specific authentication function
 * Returns authentication result without throwing errors to avoid displaying error stack
 */
async function getApiAuthState(data) {
  return await getAuthState({ 
    timeout: 10000, 
    throwOnError: false,
    data
  });
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const supabaseUrl = formData.get('supabaseUrl');
    const supabaseKey = formData.get('supabaseKey');
    const result = await getApiAuthState({supabaseUrl, supabaseKey});
    
    // Check if there are any errors
    if (result.error) {
      // For authentication-related errors, only log simple information without full stack trace
      if (result.error.includes('No access token found')) {
        console.log('User not logged in - no access token');
        return NextResponse.json(
          { error: 'No access token found' },
          { status: 401 }
        );
      }
      
      if (result.error.includes('Session error') || result.error.includes('User error')) {
        console.log('User session invalid or user not found');
        return NextResponse.json(
          { error: 'Invalid session or user not found' },
          { status: 401 }
        );
      }
      
      // Other errors
      console.log('Authentication error:', result.error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      user: result.user
    });

  } catch (error) {
    // Only log complete error information for genuine server errors
    console.error('Auth API server error:', error.message);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
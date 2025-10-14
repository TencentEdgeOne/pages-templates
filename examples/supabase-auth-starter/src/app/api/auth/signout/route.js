import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSupabaseClient } from '../../libs/supabase.js';

export async function POST(request) {
  try {
    const cookieStore = await cookies();

    let accessToken = cookieStore.get('access_token')?.value;;
    let refreshToken = cookieStore.get('refresh_token')?.value;
    let userId = cookieStore.get('user_id')?.value;

    const formData = await request.formData();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // Create response first
    const response = NextResponse.json(
      { message: 'Signed out successfully' },
      { status: 200 }
    );

    // Always clear cookies, even if user is not logged in
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    response.cookies.delete('user_id');

    // If we have tokens, try to sign out from Supabase
    if (accessToken && supabaseUrl && supabaseKey) {
      try {
        const supabase = createSupabaseClient(supabaseUrl, supabaseKey, accessToken);
        
        // Sign out from Supabase with scope 'global' to invalidate all sessions
        const { error } = await supabase.auth.signOut({ scope: 'global' });
        
        if (error) {
          console.warn('Supabase sign out warning:', error.message);
          // Don't return error here, continue with cookie cleanup
        }
      } catch (supabaseError) {
        console.warn('Supabase sign out failed:', supabaseError);
        // Continue with cookie cleanup even if Supabase signout fails
      }
    }

    return response;

  } catch (error) {
    console.error('Signout error:', error);
    
    // Even if there's an error, try to clear cookies
    const response = NextResponse.json(
      { message: 'Signed out successfully' },
      { status: 200 }
    );
    // Ensure cookies are deleted on error path as well
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    response.cookies.delete('user_id');
  
    return response;
  }
}
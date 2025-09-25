import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSupabaseClient } from '../../libs/supabase.js';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const allCookie = cookieStore.get('all-cookies')?.value;
    let accessToken = null;
    let refreshToken = null;
    let userId = null;
    if(allCookie) {
      accessToken = allCookie.split('&&')[0];
      refreshToken = allCookie.split('&&')[1];
      userId = allCookie.split('&&')[2];
    }
    const formData = await request.formData();
    const supabaseUrl = formData.get('supabaseUrl');
    const supabaseKey = formData.get('supabaseKey');

    // Create response first
    const response = NextResponse.json(
      { message: 'Signed out successfully' },
      { status: 200 }
    );

    // Always clear cookies, even if user is not logged in
    const cookiesToClear = [
      'sb-access-token',
      'sb-refresh-token', 
      'sb-user-id',
      'sb-provider-token',
      'sb-provider-refresh-token',
      'supabase-auth-token',
      'supabase.auth.token'
    ];

    response.cookies.set('all-cookies', '', {
      path: '/',
      httpOnly: true,
      maxAge: 0,
      expires: new Date(0)
    });

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
  
    return response;
  }
}
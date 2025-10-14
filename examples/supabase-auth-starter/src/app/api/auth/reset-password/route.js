import { NextResponse } from 'next/server';
import { createSupabaseClient } from '../../libs/supabase.js';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const password = formData.get('password')?.toString();
    const accessToken = formData.get('access_token')?.toString();
    const refreshToken = formData.get('refresh_token')?.toString();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: 'Access token and refresh token are required' },
        { status: 400 }
      );
    }

    console.log('Update password access_token:', accessToken);
    
    const supabase = createSupabaseClient(supabaseUrl, supabaseKey, accessToken);
    
    // Set session
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    // Update user password
    const { data, error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error('Update password error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('Update password response:', data);
    
    return NextResponse.json(
      { message: 'Password updated successfully', data },
      { status: 200 }
    );

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
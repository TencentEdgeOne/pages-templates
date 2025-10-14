import { NextResponse } from 'next/server';
import { createSupabaseClient } from '../../libs/supabase.js';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('signin error', error, error.code);
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 400 }
      );
    }
    
    const { access_token, refresh_token } = data.session;

    const accessTokenCookie = `access_token=${access_token}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=lax`;
    const refreshTokenCookie = `refresh_token=${refresh_token}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=lax`;
    const userIdCookie = `user_id=${data.user.id}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=lax`;
    const responseBody = JSON.stringify({
      success: true,
      user: data.user
    });
    return new Response(responseBody, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': [accessTokenCookie, refreshTokenCookie, userIdCookie]
      }
    });
  } catch (error) {
    console.error('Signin API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
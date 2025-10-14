import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSupabaseClient, cookieOptions } from '../../libs/supabase.js';

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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Signup error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Set cookies
    if (data.session) {
      const cookieStore = await cookies();
      const { access_token, refresh_token } = data.session;
      
      cookieStore.set('sb-access-token', access_token, cookieOptions);
      cookieStore.set('sb-refresh-token', refresh_token, cookieOptions);
      cookieStore.set('sb-user-id', data.user.id, {
        ...cookieOptions,
        httpOnly: false // User ID can be accessed on client side
      });
    }

    return NextResponse.json(
      { message: 'User created successfully', data },
      { status: 200 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
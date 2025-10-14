import { NextResponse } from 'next/server';
import { createSupabaseClient } from '../../libs/supabase.js';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const redirectTo = formData.get('redirectTo')?.toString();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${redirectTo}/reset-password`
      }
    );

    if (error) {
      console.error('Reset password error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('Reset password response:', data);
    
    return NextResponse.json(
      { message: 'Password reset email sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
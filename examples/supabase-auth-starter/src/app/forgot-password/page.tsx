'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

// This page redirects to reset-password for consistency
export default function ForgotPasswordPage() {
  useEffect(() => {
    redirect('/reset-password');
  }, []);

  return null;
}
'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function AccountClient() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const formData = new FormData();
      
      // Clear any client-side storage first - comprehensive cleanup
      if (typeof window !== 'undefined') {
        // Clear localStorage - expanded to include more auth-related keys
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (
            key.includes('supabase') || 
            key.includes('sb-') || 
            key.includes('auth') ||
            key.includes('token') ||
            key.includes('session')
          )) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Clear sessionStorage - expanded to include more auth-related keys
        const sessionKeysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && (
            key.includes('supabase') || 
            key.includes('sb-') || 
            key.includes('auth') ||
            key.includes('token') ||
            key.includes('session')
          )) {
            sessionKeysToRemove.push(key);
          }
        }
        sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
        
        // Clear any cached user data or app-specific auth state
        localStorage.removeItem('user');
        localStorage.removeItem('userProfile');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('userProfile');
      }
      
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      // Always redirect regardless of response status
      // This ensures user is logged out even if server request fails
      if (typeof window !== 'undefined') {
        // Force a hard redirect to clear any remaining client state
        window.location.href = '/';
      } else {
        router.push('/');
        router.refresh();
      }
      
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, redirect to clear client state
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      } else {
        router.push('/');
        router.refresh();
      }
    }
  };

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push('/reset-password')}
      >
        Change Password
      </Button>
      
      <Button
        variant="destructive"
        className="w-full"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  );
}
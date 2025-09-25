import { redirect } from 'next/navigation';
import { getSafeServerAuthStateViaAPI } from '@/lib/auth-ssr-api';
import AccountClient from './AccountClient';

export type User = {
  id: string;
  email: string;
  created_at: string;
}

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  // Check authentication status on server side
  const { user, loggedIn } = await getSafeServerAuthStateViaAPI();

  // If not logged in, redirect to sign in page
  if (!loggedIn || !user) {
    redirect('/signin');
  }

  // If logged in, render account page and pass user data to client component
  return (
    <>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Account</h1>
            <p className="text-muted-foreground">
              Manage your account settings
            </p>
          </div>
          
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">User Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Email:</span>
                <p className="text-sm">{user.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">User ID:</span>
                <p className="text-sm font-mono">{user.id}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Created:</span>
                <p className="text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Last Sign In:</span>
                <p className="text-sm">
                  {user.last_sign_in_at 
                    ? new Date(user.last_sign_in_at).toLocaleDateString()
                    : 'Never'
                  }
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Email Confirmed:</span>
                <p className="text-sm">
                  {user.email_confirmed_at ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              {/* Client-side interactive component */}
              <AccountClient />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
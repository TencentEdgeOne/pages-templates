import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getURL } from "../lib/utils";
import { User } from "@/App";

export function Account({ onSignOut,loggedIn,user }: { onSignOut?: () => void,loggedIn: boolean | null,user: User | null }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const res = await fetch(getURL("/auth/signout"), {
      method: "GET",
      credentials: "include"
    });
    if (res.status === 200) {
      onSignOut?.();
      navigate("/signin");
    }
  }

  

  if (loggedIn === null) {
    return (
      <>
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (!loggedIn) {
    return (
      <>
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
          <div className="w-full max-w-md space-y-4 text-center">
            <h1 className="text-2xl font-bold">Authentication Required</h1>
            <p className="text-muted-foreground">
              You need to be signed in to view this page.
            </p>
            <Button onClick={() => navigate("/signin")}>
              Sign in
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
          
          <div className="bg-card rounded-lg border p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <p className="text-muted-foreground mb-4">
              This page is protected and only visible to authenticated users.
              You're currently signed in and can view your account details.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <div className="mt-1 p-2 bg-muted rounded-md">
                  {user?.email}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Account created</label>
                <div className="mt-1 p-2 bg-muted rounded-md">
                  {user?.created_at ?? new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Security</h2>
            <p className="text-muted-foreground mb-6">
              Manage your account security settings and sign out from all devices.
            </p>
            
            <div className="space-y-4">
              <Button 
                variant="destructive" 
                className="w-full sm:w-auto"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 
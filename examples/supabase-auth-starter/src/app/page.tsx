import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/Hero";
import { getSafeServerAuthStateViaAPI } from "@/lib/auth-ssr-api";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export type User = {
  id: string;
  email: string;
  created_at: string;
}

export default async function HomePage() {
  // Check user authentication status on server side with safe fallback
  let authState: { user: User | null; loggedIn: boolean } = { user: null, loggedIn: false };
  
  try {
    const result = await getSafeServerAuthStateViaAPI();
    authState = {
      user: result.user as User | null,
      loggedIn: result.loggedIn
    };
  } catch (error) {
    console.error('Failed to get auth state on homepage:', error);
    // authState already has fallback values
  }

  const { user, loggedIn } = authState;

  return (
    <div className="min-h-screen">
      <NavBar loggedIn={loggedIn} user={user as User | undefined}/>
      <main>
        <Hero />
      </main>
    </div>
  );
}
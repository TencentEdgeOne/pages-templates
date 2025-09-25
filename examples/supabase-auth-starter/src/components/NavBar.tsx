import { Button } from "@/components/ui/button";
import Link from "next/link";

type User = {
  id: string;
  email: string;
  created_at: string;
} | null;

export const NavBar = function ({loggedIn, user}: {loggedIn: boolean | null, user?: User}) {
  

  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="text-xl font-bold">Supabase Auth Starter</Link>
          {loggedIn === null ? <></>: <div className="flex items-center gap-4">
            {loggedIn ?  
              <>
                <Button variant="ghost" asChild>
                  <Link href="/account">Account</Link>
                </Button>
              </>
              : <>
               <Button variant="ghost" asChild>
                <Link href="/signin">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
            }
          </div>}
        </div>
      </div>
    </nav>
  );
}
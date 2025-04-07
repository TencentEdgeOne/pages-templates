import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const NavBar = function ({loggedIn}: {loggedIn: boolean | null}) {
  

  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="text-xl font-bold">Supabase Auth Starter</Link>
          {loggedIn === null ? <></>: <div className="flex items-center gap-4">
            {loggedIn ?  
              <>
                <Button variant="ghost" asChild>
                  <Link to="/account">Account</Link>
                </Button>
              </>
              : <>
               <Button variant="ghost" asChild>
                <Link to="/signin">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
            }
          </div>}
        </div>
      </div>
    </nav>
  );
}
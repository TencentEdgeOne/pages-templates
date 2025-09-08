
import React, { useState, useEffect, useMemo } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    
   

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isLoggedIn = useMemo(() => {
    return localStorage.getItem("sb-user-id");
  }, [location]);
  console.log("isLoggedIn", isLoggedIn);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = async () => {
    const res = await fetch("/auth/signout", {
      credentials: "include",
    });
    if (res.status === 200) {
      localStorage.removeItem("sb-user-id");
      window.location.href = "/signin";
      return;
    }
    alert(await res.text());
  };



  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8",
        isScrolled
          ? "py-3 bg-white/80 backdrop-blur-md shadow-md"
          : "py-5 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full orange-gradient flex items-center justify-center">
            <span className="text-white font-bold text-sm">OS</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Stripe Subscription Starter
          </span>
        </a>

      

        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Button
                variant="outline"
                className="font-medium border-orange-200 text-orange-600 hover:bg-orange-50"
                onClick={() => navigate("/account")}
              >
                <User className="mr-2 h-4 w-4" /> My Account
              </Button>
              <Button
                variant="outline"
                className="font-medium border-orange-200 text-orange-600 hover:bg-orange-50"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="font-medium border-orange-200 text-orange-600 hover:bg-orange-50"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </Button>
              <Button
                className="font-medium bg-orange-500 hover:bg-orange-600"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-fade-in-up">
          <div className="px-4 py-4 space-y-3">

            <div className="pt-3 grid grid-cols-2 gap-2">
              {isLoggedIn ? (
                <>
                  <Button
                    variant="outline"
                    className="w-full font-medium border-orange-200 text-orange-600 hover:bg-orange-50"
                    onClick={() => {
                      navigate("/account");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" /> My Account
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full font-medium border-orange-200 text-orange-600 hover:bg-orange-50"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full font-medium border-orange-200 text-orange-600 hover:bg-orange-50"
                    onClick={() => {
                      navigate("/signin");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full font-medium bg-orange-500 hover:bg-orange-600"
                    onClick={() => {
                      navigate("/signup");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

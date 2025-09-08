
import React, { useEffect, useState  } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const Auth = ({mode}) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const urlSearchParams = new URLSearchParams(window.location.search);
  const {redirectUrl} =   Object.fromEntries(urlSearchParams.entries());

  useEffect(() => {
    setIsSignUp(mode === 'signup');
  }, [mode]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formdata = new FormData();
      formdata.append("email", email);
      formdata.append("password", password);
      return fetch(`/auth/signup`, {
        method: "POST",
        body: formdata,
      }).then(async (resp) => {
        if (resp.status === 200) {
          alert("Sign Up Successfully, jumping to log in...");
          return (window.location.href = "/signin");
        }
        alert(await resp.text());
      });
    } catch (error: any) {
      toast.error(error.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };
  const handleSignIn = async (e: React.FormEvent) => {
    console.log("submit");
    const formdata = new FormData();
    formdata.append("email", email);
    formdata.append("password", password);
    return fetch(`/auth/login`, {
      method: "POST",
      body: formdata,
      credentials: "include",
    }).then(async (resp) => {
      if (resp.status !== 200) {
        alert(await resp.text());
        return;
      }
      // console.log("登录成功", await resp.text());
      location.href = redirectUrl || "/account";
      localStorage.setItem("sb-user-id", await resp.text());
    });
  }

  const handleAuth = async (e: React.FormEvent) => {
    if (isSignUp) {
      await handleSignUp(e);
    } else {
      await handleSignIn(e);
    }
    return true;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md glass">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full orange-gradient flex items-center justify-center">
              <span className="text-white font-bold text-lg">OS</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? "Create an account" : "Welcome back"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp
              ? "Enter your information to create an account"
              : "Enter your credentials to sign in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            {isSignUp && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => {
                    setAgreedToTerms(checked as boolean);
                  }}
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <a href="#" className="text-orange-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-orange-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            )}

            <Button
              onClick={handleAuth}
              className="w-full"
              disabled={loading || (isSignUp && !agreedToTerms)}
            >
              {loading ? (
                "Processing..."
              ) : isSignUp ? (
                <>
                  Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-center w-full">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-orange-600 hover:underline"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;

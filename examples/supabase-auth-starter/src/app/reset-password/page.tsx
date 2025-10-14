'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

// Component for requesting a password reset
function RequestPasswordReset() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("redirectTo", process.env.NEXT_PUBLIC_SITE_URL || '');
      
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: formData,
      });
      
      if (response.status === 200) {
        setSuccess(true);
      } else {
        const data = await response.text();
        setError(data || "Failed to send reset email");
      }
    } catch (error) {
      console.error("Password reset request failed:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Forgot Your Password?</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
              <p>If an account exists with that email, we've sent password reset instructions.</p>
              <p className="mt-2">Please check your email inbox and spam folder.</p>
            </div>
          ) : (
            <form onSubmit={handleRequestReset} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <p>{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="your@email.com"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending Reset Link..." : "Send Reset Link"}
              </Button>
            </form>
          )}

          <div className="text-center text-sm">
            Remember your password?{" "}
            <a href="/signin" className="text-primary hover:underline">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get token from URL hash parameters
    const hashString = window.location.hash.split("#")[1];
    const params = {} as any;
    if (hashString) {
      hashString.split("&").forEach(param => {
        const [key, value] = param.split("=");
        params[key] = value;
      });
    }
    
    setAccessToken(params["access_token"] || null);
    setRefreshToken(params["refresh_token"] || null);
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append("password", password);
      formData.append("access_token", accessToken || "");
      formData.append("refresh_token", refreshToken || "");
      
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (response.status === 200) {
        setSuccess(true);
        // Redirect to sign in page after 3 seconds
        setTimeout(() => {
          router.push("/signin");
        }, 3000);
      } else {
        const data = await response.text();
        setError(data || "Password reset failed");
      }
    } catch (error) {
      console.error("Password reset failed:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If no token is provided, show request password reset form
  if (!accessToken) {
    return <RequestPasswordReset />;
  }

  return (
    <>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Reset Your Password</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your new password below
            </p>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
              <p>Password reset successful! Redirecting to login page...</p>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <p>{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="At least 6 characters"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </form>
          )}

          <div className="text-center text-sm">
            Remember your password?{" "}
            <a href="/signin" className="text-primary hover:underline">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getURL } from "../lib/utils";

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get token from URL query parameters
  // URL example:http://localhost:5173/reset-password#access_token=eyJhbGciOiJIUzI1NiIsImtpZCI6Imw5MHAzY1VFUFRwTWRndmgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3FjemRnYXlrY3ZzeHRmZHlieXd5LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIwYzkwNGVhYi1kNWFiLTRkNWMtOGM2Zi1lMmRkZjQ5MGFlMjciLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQzNDI0MTYzLCJpYXQiOjE3NDM0MjA1NjMsImVtYWlsIjoibXVzaHJvb20xMjMwMUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoibXVzaHJvb20xMjMwMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiIwYzkwNGVhYi1kNWFiLTRkNWMtOGM2Zi1lMmRkZjQ5MGFlMjcifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJvdHAiLCJ0aW1lc3RhbXAiOjE3NDM0MjA1NjN9XSwic2Vzc2lvbl9pZCI6IjkzOTMzNjgwLThkNzItNGEyMS1hOTM3LTU0ZDJhMzc4ZWVhYiIsImlzX2Fub255bW91cyI6ZmFsc2V9.pjjcamFTwT0ov5znYsHv9P78EXxjQzjTcqidvjMpTl0&expires_at=1743424163&expires_in=3600&refresh_token=cz2sobUlyHFcENr1Tnz89g&token_type=bearer&type=recovery
  // get access_token from url
  const hashString = location.hash.split("#")[1];
  const params = {} as any;
  if (hashString) {
    hashString.split("&").forEach(param => {
    const [key, value] = param.split("=");
    params[key] = value;
  })
  }
  
  const access_token = params["access_token"];
  const refresh_token = params["refresh_token"];

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
      // Here we'll add the actual password reset logic
      const formData = new FormData();
      formData.append("password", password);
      formData.append("access_token", access_token || "");
      formData.append("refresh_token", refresh_token || "");
      
      const response = await fetch(getURL("/auth/reset-password"), {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (response.status === 200) {
        setSuccess(true);
        // Redirect to sign in page after 3 seconds
        setTimeout(() => {
          navigate("/signin");
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
  if (!access_token) {
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
            <Link to="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

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
      
      const response = await fetch(getURL("/auth/forgot-password"), {
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
            <Link to="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 
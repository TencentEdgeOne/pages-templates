import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/Hero";
import { SignIn } from "@/pages/SignIn";
import { SignUp } from "@/pages/SignUp";
import { Account } from "@/pages/Account";
import { ResetPassword } from "@/pages/ResetPassword";
import { useEffect, useState } from "react";
import { getURL } from "./lib/utils";

export type User = {
  id: string;
  email: string;
  created_at: string;
}
function HomePage() {
  return (
    <>
      <main>
        <Hero />
      </main>
    </>
  );
}


function App() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const handleAuthRequest = async () => {
    try {
      const response = await fetch(getURL('/auth/user'), {
        method: 'GET',
        credentials: 'include',
      });
      if (response.status === 200) {
        const {user} = await response.json();
        setUser(user);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    } catch (error) {
      console.error('认证请求失败:', error);
    }
  };


  useEffect(() => {
    handleAuthRequest();
  }, []);

 
  return (
    <Router>
      <div className="min-h-screen">
        <NavBar loggedIn={loggedIn}/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn onSignIn={() => {setLoggedIn(true)}}/>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/account" element={<Account loggedIn={loggedIn} user={user} onSignOut={() => {setLoggedIn(false)}}/>} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

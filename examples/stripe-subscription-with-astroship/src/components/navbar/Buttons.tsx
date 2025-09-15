import { useMemo } from "react";

export default function NavbarButtons({}) {
  const isLoggedIn = useMemo(() => {
    return localStorage.getItem("sb-user-id");
  }, [location]);
  const logOut = async () => {
    const res = await fetch("/auth/signout", {
      credentials: "include"
    });
    if (res.status === 200) {
      localStorage.removeItem("sb-user-id");
      window.location.href = "/login"
      return;
    }
    alert(await res.text());
  }
  console.log("isLoggedIn", localStorage);
  return isLoggedIn ? (
    <>
      <a href="/account">My Account</a>
      <a onClick={logOut}>Log out</a>
    </>
  ) : (
    <>
      <a href="/login">Log in</a>
      <a
        href="/signup"
        className="rounded-sm text-center transition focus-visible:ring-2 ring-offset-2 ring-gray-200 px-4 py-2 bg-black text-white hover:bg-gray-800  border-2 border-transparent">
        Sign up
      </a>
    </>
  );
}

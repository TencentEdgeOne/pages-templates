import { createSupabaseClient } from "../libs/supabase";

function getSetCookie(cookie) {
  const cookieArr = [
    `${encodeURIComponent(cookie.name)}=${encodeURIComponent(cookie.value)}`,
  ];

  const key2name = {
    expires: "Expires",
    max_age: "Max-Age",
    domain: "Domain",
    path: "Path",
    secure: "Secure",
    httponly: "HttpOnly",
    samesite: "SameSite",
  };

  Object.keys(key2name).forEach((key) => {
    
    if (cookie[key] !== undefined) {
      cookieArr.push(`${key2name[key]}=${cookie[key]}`);
    }
  });

  return cookieArr.join("; ");
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  const { data, error } = await createSupabaseClient(
    env,
  ).auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return new Response(error.code, { status: 500 });
  }

  const { access_token, refresh_token } = data.session;
  const cookies = new Cookies();
  cookies.set("sb-access-token", access_token, {
    path: "/",
    max_age: 31536000,
    httponly: true,
  });
  cookies.set("sb-refresh-token", refresh_token, {
    path: "/",
    max_age: 31536000,
    httponly: true,
  });
  cookies.set("sb-user-id", data.user.id, {
    path: "/",
    max_age: 31536000,
  });

  // const headers = {};
  const headers = new Headers();

  headers.append("Set-Cookie", getSetCookie(cookies.get("sb-access-token")));
  headers.append("Set-Cookie", getSetCookie(cookies.get("sb-refresh-token")));
  headers.append("Set-Cookie", getSetCookie(cookies.get("sb-user-id")));
  headers.append("Content-Type", "text/html; charset=UTF-8");
  return new Response(data.user.id, {
    headers,
  });
}

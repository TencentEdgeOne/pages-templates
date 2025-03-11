import { login } from "../common/graphql";


export async function onRequestPost(context) {
  const { request, env } = context;
  const { email, password } = await request.json();
  const headers = {
    'content-type': 'text/html; charset=UTF-8',
    'x-edgefunctions-test': 'Welcome to use Pages Functions.',
  };

  const loginRes = await login(email, password, env).catch((e) => {
    console.log('login error', e);
    return null;
  });

  if (loginRes) {
    headers['Set-Cookie'] = `auth-data=${JSON.stringify(loginRes)}; HttpOnly;  Path=/; Max-Age=31536000`;
    const response =  new Response(JSON.stringify({
      code: 0,
      message: 'Login success',
      ...loginRes
    }), {
      headers,
    });

    return response;
  } else {
    return new Response(JSON.stringify({
      code: 1,
      message: 'Login failed',
    }));
  }
}


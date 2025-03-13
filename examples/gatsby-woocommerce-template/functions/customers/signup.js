import { register } from "../common/graphql";


export async function onRequestPost(context) {
  const { request, env } = context;
  const { email, password } = await request.json();
  const headers = {
    'content-type': 'text/json; charset=UTF-8',
    'x-edgefunctions-test': 'Welcome to use Pages Functions.',
  };

  const registerRes = await register(email, password, env).catch((e) => {
    console.log('register error', e);
    return null;
  });
  
  
  // 生产环境下 Secure 应该是 true
  if (registerRes) {
    headers['Set-Cookie'] = `auth-data=${JSON.stringify(registerRes)}; HttpOnly;  Path=/; Max-Age=31536000`;
    const response = new Response(JSON.stringify({
      code: 0,
      message: 'Register success',
      ...registerRes
    }), {
      status: 200,
      headers
    });


    return response;
  } else {
    return new Response(JSON.stringify({
      code: 0,
      message: 'Register fail',
    }), {
      status: 200,
      headers
    });
  }
  
}


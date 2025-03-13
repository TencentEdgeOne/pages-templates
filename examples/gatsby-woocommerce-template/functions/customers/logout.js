export async function onRequestPost(context) {
  console.log('logout');
  const response = new Response(JSON.stringify({
    code: 0,
    message: 'Logout success',
  }), {
    status: 200,
    headers: {
      'Set-Cookie': `auth-data=${JSON.stringify({})}; HttpOnly;  Path=/; Max-Age=31536000`,
    }
  });
  return response;

}


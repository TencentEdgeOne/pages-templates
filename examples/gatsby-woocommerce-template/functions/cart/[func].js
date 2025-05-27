import { dispatchGraphql } from "../common/graphql";
import { CommonResponseHeaders } from "../common/header";


export async function onRequest(context) {
  const { request, params, env } = context;

  if (request.method === 'GET') {
    try {
      const { request, params, env } = context;
      const headers = { ...CommonResponseHeaders };

      const cookie = new Cookies(request.headers.get('cookie'));
      let authData = cookie.get('auth-data');
      let authDataJSON;
      console.log('authData', authData);
      if (authData) {
        if (Array.isArray(authData)) {
          authData = authData[0];
        }
        // get-cart allows no auth data
        if (params.func !== 'get-cart') {
          if (!authData) {
            console.log('no auth data');
            return new Response(JSON.stringify({
              code: 1,
              message: 'no auth data'
            }), CommonResponseHeaders)
          }
        }
        console.log('authDataJSON', authData.value);
        authDataJSON = JSON.parse(decodeURIComponent(authData.value));
      } else {
        authDataJSON = {};
      }


      let result = {};
      await dispatchGraphql(params.func, null, authDataJSON, env, headers).then(({ res, auth }) => {
        headers['Set-Cookie'] = `auth-data=${JSON.stringify(auth)}; HttpOnly;  Path=/; Max-Age=31536000`;

        result = {
          code: 0,
          message: 'success',
          data: res
        };
      }).catch((e) => {
        headers['Set-Cookie'] = '';
        result = {
          code: 1,
          // TODO: e.message to log
          message: e.message
        }
      });
      return new Response(JSON.stringify(result), {
        headers,
      });
    } catch (error) {
      console.log('fetch error', error);
      return new Response(JSON.stringify({ code: -1, error: JSON.stringify(error) }));
    }
  } else {
    try {

      const data = await request.json();

      const cookie = new Cookies(request.headers.get('cookie'));
      let authData = cookie.get('auth-data');
      console.log('authData', authData);
      if (Array.isArray(authData)) {
        authData = authData[0];
      }
      if (!authData) {
        return new Response(JSON.stringify({
          code: 1,
          message: 'no auth data'
        }), CommonResponseHeaders)
      }
      console.log('authData1111', authData.value);
      const authDataJSON = JSON.parse(decodeURIComponent(authData.value));


      let result = {};
      const headers = { ...CommonResponseHeaders };
      await dispatchGraphql(params.func, data, authDataJSON, env, headers).then(({ res, auth }) => {
        headers['Set-Cookie'] = `auth-data=${JSON.stringify(auth)}; HttpOnly;  Path=/; Max-Age=31536000`;

        result = {
          code: 0,
          message: 'success',
          data: res
        };
      }).catch((e) => {
        result = {
          code: 1,
          message: e.message
        }
      });
      return new Response(JSON.stringify(result), {
        headers,
      });
    } catch (error) {
      console.log('error', error);
      return new Response(JSON.stringify({ code: -1, error: JSON.stringify(error) }));
    }
  }
  

}


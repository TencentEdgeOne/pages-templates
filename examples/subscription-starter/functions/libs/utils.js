export function getURL(env, path) {
  let base = env.DEV ? env.FRONT_END_URL_DEV : '/';
  if (base.endsWith('/')) {
    base = base.split("");
    base.pop();
    base = base.join("");
  }
  return `${base}${path}`
}
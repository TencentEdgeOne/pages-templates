/** */
export const getFormattedDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

export function getURL(path) {
  let base = import.meta.env.DEV ? import.meta.env.PUBLIC_API_URL_DEV : '/';
  if (base.endsWith('/')) {
    base = base.split("");
    base.pop();
    base = base.join("");
  }
  return `${base}${path}`
}
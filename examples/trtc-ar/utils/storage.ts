export function setStorage(key: string, value: unknown) {
  const encoded = JSON.stringify(value);
  window.localStorage.setItem(key, encoded);
}

export function getStorage(key: string) {
  const encoded = window.localStorage.getItem(key);
  if (encoded === null) {
    return undefined;
  }
  try {
    return JSON.parse(encoded);
  } catch (e) {
    return undefined;
  }
}

export function removeStorage(key: string) {
  window.localStorage.removeItem(key);
}


export function setCookie(cookie, value) {
  document.cookie = `${cookie}=${value}`;
}

export function deleteCookie(cookie) {
  document.cookie = `${cookie}=; expires=Sun, 31 Dec 1899 00:00:00 GMT;`;
}

export function getCookie(cookie) {
  const valueFinder = new RegExp(`${cookie}=(.*?)(?:;|$)`, "gm");
  const result = valueFinder.exec(document.cookie);
  return (result && result[1]) || null;
}

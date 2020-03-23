
const storage = window.sessionStorage;

export function getToken() {
  return storage.getItem("token");
}

export function setToken(value) {
  storage.setItem("token", value);
}

export function deleteToken() {
  storage.removeItem("token");
}

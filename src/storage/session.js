
const storage = window.sessionStorage;

function getToken() {
  return storage.getItem("token");
}

function setToken(value) {
  storage.setItem("token", value);
}

function deleteToken() {
  storage.removeItem("token");
}

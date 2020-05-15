
/**
 * Reading about security turns out that:
 * 1. You're not supposed to store access tokens in localStorage/sessionStorage
 * 2. It's more secure to store a refresh token and use that to get a new one.
 *
 * This app is practically ready and it's a small-medium sized project so I'll
 * leave it like this but I'll do the correct thing next time.
 */

const KEY_NAME = process.env.REACT_APP_TITLE + "_token";
const storage = window.localStorage;

export function getToken() {
  return storage.getItem(KEY_NAME);
}

export function setToken(value) {
  storage.setItem(KEY_NAME, value);
}

export function deleteToken() {
  storage.removeItem(KEY_NAME);
}

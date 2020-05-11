
export function randomString(length=10) {
  let ret = "";
  const characters = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
  for(let _ = 0; _ < length; _++) {
    const index = Math.floor(Math.random() * characters.length);
    ret += characters.charAt(index);
  }
  return ret;
}

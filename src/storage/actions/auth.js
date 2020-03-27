import axios from "axios";
import { protectFunction, makeAction } from "../../util/control";
import { getToken, setToken, deleteToken } from "../session";

const dummyToken = "AEOFHAEOHFOAEFOGFAEGU";

export function login(user, pswd) {
  const creator = async function(dispatch) {
    const config = {
      headers: { "Authorization": `Basic ${user}:${pswd}` }
    }
    await attemptLogin(dispatch, config);
  }

  return makeAction(creator, "auth", "SET_LOGIN_CREDENTIALS");
}

export function tokenAuth() {
  const creator = async function(dispatch) {
    const token = getToken();
    const config = {
      headers: { "Authorization": `Bearer ${token}` },
    };
    await attemptLogin(dispatch, config);
  }

  return protectFunction(makeAction(creator, "auth", "SET_LOGIN_INIT"));
}

async function attemptLogin(dispatch, config) {
  try {
    // const { REACT_APP_BACKEND } = process.env;
    // const response = await axios.get(`${REACT_APP_BACKEND}/auth`, config);

    // Simulate a request
    const response = await axios.get("http://localhost/testcodes.php?code=200");
    const { error } = response.data;

    if(!error) {
      setToken(dummyToken);
      dispatch({ type: "SET_LOGIN", token: dummyToken });
    }
    else {
      dispatch({ type: "ERROR", store: "auth", error: error.title });
    }
  }
  catch(e) {
    let error = e.message;
    if(e.response) {
      const { status } = e.response;
      error = status;
    }
    dispatch({ type: "ERROR", store: "auth", error });
  }
}

export function logout() {
  return function(dispatch) {
    dispatch("RESET_LOGIN");
    dispatch("RESET_LOGS");
    dispatch("RESET_SCHEDULES");
    dispatch("RESET_ACCOUNTS");
    deleteToken();
  }
}

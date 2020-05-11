import axios from "axios";
import { protectFunction, makeAction } from "../../util/control";
import { getToken, setToken, deleteToken } from "../session";

export function login(user, pswd) {
  const creator = async function(dispatch) {
    const config = {
      headers: { "Authorization": `Basic ${user}:${pswd}` }
    }
    await attemptLogin(dispatch, config);
  }

  return makeAction(creator, "auth", "SET_AUTH_CREDENTIALS");
}

export function tokenAuth() {
  const creator = async function(dispatch) {
    const token = getToken();
    const config = {
      headers: { "Authorization": `Bearer ${token}` },
    };
    await attemptLogin(dispatch, config);
  }

  if(!getToken()) {
    return { type: "SET_AUTH", anonymous: true };
  }
  return protectFunction(makeAction(creator, "auth", "SET_AUTH_INIT"));
}

async function attemptLogin(dispatch, config) {
  try {
    const { REACT_APP_BACKEND } = process.env;
    const response = await axios.get(`${REACT_APP_BACKEND}/auth`, config);
    const { errors } = response.data;

    if(!errors) {
      const token = response.data.data.token
      setToken(token);
      dispatch({ type: "SET_AUTH", token });
    }
    else {
      dispatch({ type: "ERROR", store: "auth", error: errors[0].title });
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
    const actions = ["RESET_AUTH", "RESET_LOGS", "RESET_SCHEDULES", "RESET_ACCOUNTS"];
    for(const type of actions) {
      dispatch({ type });
    }
    deleteToken();
  }
}

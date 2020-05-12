import axios from "axios";
import { protectFunction, makeAction } from "../../util/control";
import { getToken, setToken, deleteToken } from "../session";

export function login(user, pswd) {
  const creator = async function(dispatch) {
    try {
      const { REACT_APP_BACKEND } = process.env;
      const config = {
        headers: { "Authorization": `Basic ${user}:${pswd}` }
      }
      const response = await axios.get(`${REACT_APP_BACKEND}/auth`, config);
      const { errors } = response.data;

      if(!errors) {
        const token = response.data.data.token;
        setToken(token);
        dispatch({ type: "SET_AUTH", token });
        for(const ignored of response.data.data.ignored) {
          dispatch({ type: "IGNORE_LOGS", level: ignored.level, amount: ignored.ignored });
        }
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

  return makeAction(creator, "auth", "SET_AUTH_CREDENTIALS");
}

export function tokenAuth() {
  const creator = async function(dispatch) {
    try {
      const { REACT_APP_BACKEND } = process.env;
      const token = getToken();
      const config = {
        headers: { "Authorization": `Bearer ${token}` },
      };
      const response = await axios.get(`${REACT_APP_BACKEND}/auth/me`, config);
      const { errors } = response.data;

      if(!errors) {
        setToken(token);
        dispatch({ type: "SET_AUTH", token });
        for(const ignored of response.data.data.ignored) {
          dispatch({ type: "IGNORE_LOGS", level: ignored.level, amount: ignored.ignored });
        }
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

  if(!getToken()) {
    return { type: "SET_AUTH", anonymous: true };
  }
  return protectFunction(makeAction(creator, "auth", "SET_AUTH_INIT"));
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

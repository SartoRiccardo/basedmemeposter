import axios from "axios";
import { callIfSuccessful, protectFunction, makeAction } from "../../util/control";
import { getToken, setToken, deleteToken } from "../session";

const dummyToken = "AEOFHAEOHFOAEFOGFAEGU";

export function login(user, pswd) {
  const creator = async function(dispatch) {
    try {
      // const { REACT_APP_BACKEND } = process.env;
      //
      // const config = {
      //   headers: { "Authorization": `Basic ${user}:${pswd}` }
      // }
      //
      // const response = await axios.get(`${REACT_APP_BACKEND}/auth`, config);

      // Simulate a request
      const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");

      callIfSuccessful(response, () => {
        setToken(dummyToken);
        dispatch({ type: "SET_LOGIN", token: dummyToken });
      }, (error) => {
        dispatch({ type: "ERROR", store: "auth", error: error.title });
      });
    }
    catch(e) {
      dispatch({ type: "ERROR", store: "auth", error: e.message });
    }
  }

  return makeAction(creator, "auth", "SET_LOGIN_CREDENTIALS");
}

export function tokenAuth() {
  const creator = async function(dispatch) {
    try {
      const token = getToken();
      // const { REACT_APP_BACKEND } = process.env;
      //
      // const config = {
      //   headers: { "Authorization": `Basic ${user}:${pswd}` }
      // }
      //
      // const response = await axios.get(`${REACT_APP_BACKEND}/auth`, config);

      // Simulate a request
      const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");

      callIfSuccessful(response, () => {
        setToken(token);
        dispatch({ type: "SET_LOGIN", token });
      }, (error) => {
        dispatch({ type: "ERROR", store: "auth", error: error.title });
      });
    }
    catch(e) {
      dispatch({ type: "ERROR", store: "auth", error: e.message });
    }
  }

  return protectFunction(makeAction(creator, "auth", "SET_LOGIN_INIT"));
}

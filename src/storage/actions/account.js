import axios from "axios";
import { callIfSuccessful, protectFunction, makeAction } from "../../util/control";
import JSEncrypt from "jsencrypt";

const dummyAccounts = [
  { id: 1, username: "basedmemeposter", startTime: "10:00:00", endTime: "21:00:00" },
  { id: 2, username: "contrafreedom", startTime: "12:00:00", endTime: "23:00:00" },
  { id: 5, username: "ihatereddit", startTime: "22:00:00", endTime: "06:00:00" },
];

export function fetchAccounts() {
  const creator = async function(dispatch) {
    try {
      // const { REACT_APP_BACKEND } = process.env;
      // const response = await axios.get(`${REACT_APP_BACKEND}/accounts`);

      // Simulate a request
      const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");

      callIfSuccessful(response, () => {
        dispatch({
          type: "SET_ACCOUNTS",
          accounts: dummyAccounts,
        });
        for(const account of dummyAccounts) {
          fetchAccountAvatar(account.id, account.username)(dispatch);
        }
      }, (error) => {
        dispatch({ type: "ERROR", store: "account", error: error.title });
      });
    }
    catch(e) {
      dispatch({ type: "ERROR", store: "account", error: e.message });
    }
  }

  return protectFunction(makeAction(creator, "account", "SET_ACCOUNTS"));
}

export function fetchAccountAvatar(id, username) {
  const creator = async function(dispatch) {
    try {
      const response = await axios.get(`https://www.instagram.com/${username}/?__a=1`);

      callIfSuccessful(response, () => {
        const avatar = response.data.graphql.user.profile_pic_url;
        dispatch({ type: "SET_ACCOUNT_IMAGE", accountId: id, avatar });
      });
    }
    catch(e) {
      // dispatch({ type: "ERROR", store: "account", error: e.message });
    }
  }

  return protectFunction(makeAction(creator, "account", "SET_ACCOUNT_IMAGE"));
}

export function addAccount(account) {
  const creator = async function(dispatch) {
    try {
      const { REACT_APP_BACKEND, REACT_APP_PUBLIC_KEY } = process.env;
      // const response = await axios.post(`${REACT_APP_BACKEND}/accounts`, account);

      const encryptor = new JSEncrypt();
      encryptor.setPublicKey(REACT_APP_PUBLIC_KEY);
      account.password = encryptor.encrypt(account.password);
      // Simulate a request
      const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");

      callIfSuccessful(
        response,
        () => {
          const newAccountId = Math.floor(Math.random()*1000);
          account.id = newAccountId;
          dispatch({ type: "ADD_ACCOUNT", account });
        },
        error => dispatch({ type: "ERROR", store: "account", error: error.title })
      );
    }
    catch(e) {
      dispatch({ type: "ERROR", store: "account", error: e.message });
    }
  }

  return protectFunction(makeAction(creator, "account", "ADD_ACCOUNT"));
}

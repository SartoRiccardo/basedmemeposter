import axios from "axios";
import { callIfSuccessful, protectFunction, makeAction } from "../../util/control";

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
          try {
          fetchAccountAvatar(account.id, account.username)(dispatch);
          }catch(e){console.log(e);}
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

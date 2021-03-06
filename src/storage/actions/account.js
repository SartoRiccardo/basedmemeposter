import axios from "axios";
import { getToken } from "../session";
import { protectFunction, makeAction } from "../../util/control";
import { getUserAvatar } from "../../util/instagram";
import { toUtcTime } from "../../util/time";
import JSEncrypt from "jsencrypt";

export function fetchAccounts() {
  const creator = async function(dispatch) {
    const { REACT_APP_BACKEND } = process.env;
    const config = { headers: { "X-Authorization": `Bearer ${getToken()}` } };
    const response = await axios.get(`${REACT_APP_BACKEND}/accounts`, config);

    const accounts = response.data.data;
    dispatch({ type: "SET_ACCOUNTS", accounts });
    for(const account of accounts) {
      fetchAccountAvatar(account.id, account.username)(dispatch);
    }
  }

  return protectFunction(makeAction(creator, "account", "SET_ACCOUNTS"));
}

export function fetchAccountAvatar(id, username) {
  const creator = async function(dispatch) {
    const avatar = await getUserAvatar(username);
    if(!avatar) {
      return null;
    }
    dispatch({ type: "SET_ACCOUNT_IMAGE", accountId: id, avatar });
  }

  return protectFunction(makeAction(creator, "account", "SET_ACCOUNT_IMAGE"));
}

export function addAccount(account, utc=false) {
  const creator = async function(dispatch) {
    const { REACT_APP_BACKEND, REACT_APP_PUBLIC_KEY } = process.env;

    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(REACT_APP_PUBLIC_KEY);
    account.password = encryptor.encrypt(account.password);

    if(!utc) {
      account = {
        ...account,
        startTime: toUtcTime(account.startTime),
        endTime: toUtcTime(account.endTime),
      };
    }

    const config = { headers: { "X-Authorization": `Bearer ${getToken()}` } };
    const response = await axios.post(`${REACT_APP_BACKEND}/accounts`, account, config);

    const newAccountId = response.data.data.id;
    account.id = newAccountId;
    delete account.password;
    dispatch({ type: "ADD_ACCOUNT", account });
    fetchAccountAvatar(newAccountId, account.username)(dispatch);
  }

  return protectFunction(makeAction(creator, "account", "ADD_ACCOUNT"));
}

export function updateAccount(accountId, account, passwordHasChanged, utc=false) {
  const creator = async dispatch => {
      const { REACT_APP_BACKEND, REACT_APP_PUBLIC_KEY } = process.env;
      if(!passwordHasChanged) {
        delete account.password;
      }
      else {
        const encryptor = new JSEncrypt();
        encryptor.setPublicKey(REACT_APP_PUBLIC_KEY);
        account.password = encryptor.encrypt(account.password);
      }

      if(!utc) {
        console.log(account.startTime, toUtcTime(account.startTime));
        account = {
          ...account,
          startTime: toUtcTime(account.startTime),
          endTime: toUtcTime(account.endTime),
        };
      }

      const config = { headers: { "X-Authorization": `Bearer ${getToken()}` } };
      await axios.put(`${REACT_APP_BACKEND}/accounts/${accountId}`, account, config);

      if(account.password) {
        delete account.password;
      }
      account.id = accountId;
      dispatch({ type: "UPDATE_ACCOUNT", account });
      fetchAccountAvatar(account.id, account.username)(dispatch);
  }

  return protectFunction(makeAction(creator, "account", "UPDATE_ACCOUNT"));
}

export function deleteAccount(accountId) {
  const creator = async dispatch => {
      const { REACT_APP_BACKEND } = process.env;

      const config = { headers: { "X-Authorization": `Bearer ${getToken()}` } };
      await axios.delete(`${REACT_APP_BACKEND}/accounts/${accountId}`, config);

      dispatch({ type: "DELETE_ACCOUNT", accountId });
  }

  const extraParams = { accountId };
  return protectFunction(makeAction(creator, "account", "DELETE_ACCOUNT", extraParams));
}

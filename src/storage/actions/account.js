import axios from "axios";
import { getToken } from "../session";
import { carryOrFail, protectFunction, makeAction } from "../../util/control";
import { getUserAvatar } from "../../util/instagram";
import JSEncrypt from "jsencrypt";

export function fetchAccounts() {
  const creator = async function(dispatch) {
    const { REACT_APP_BACKEND } = process.env;
    const config = { headers: { "Authorization": `Bearer ${getToken()}` } };
    const response = await axios.get(`${REACT_APP_BACKEND}/accounts`, config);

    const accounts = response.data.data;
    dispatch({ type: "SET_ACCOUNTS", accounts });
    for(const account of accounts) {
      fetchAccountAvatar(account.id, account.username)(dispatch);
    }
  }

  return protectFunction(
    carryOrFail(
      makeAction(creator, "account", "SET_ACCOUNTS"),
      "account"
      )
    );
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

export function addAccount(account) {
  const creator = async function(dispatch) {
    const { REACT_APP_BACKEND, REACT_APP_PUBLIC_KEY } = process.env;

    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(REACT_APP_PUBLIC_KEY);
    account.password = encryptor.encrypt(account.password);

    const config = { headers: { "Authorization": `Bearer ${getToken()}` } };
    const response = await axios.post(`${REACT_APP_BACKEND}/accounts`, account, config);

    const newAccountId = response.data.data.id;
    account.id = newAccountId;
    delete account.password;
    dispatch({ type: "ADD_ACCOUNT", account });
    fetchAccountAvatar(newAccountId, account.username)(dispatch);
  }

  return protectFunction(
    carryOrFail(
      makeAction(creator, "account", "ADD_ACCOUNT"),
      "account"
    )
  );
}

export function updateAccount(accountId, account, passwordHasChanged) {
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

      const config = { headers: { "Authorization": `Bearer ${getToken()}` } };
      const response = await axios.put(`${REACT_APP_BACKEND}/accounts/${accountId}`, account, config);

      if(account.password) {
        delete account.password;
      }
      account.id = accountId;
      dispatch({ type: "UPDATE_ACCOUNT", account });
      fetchAccountAvatar(account.id, account.username)(dispatch);
  }

  return protectFunction(
    carryOrFail(
      makeAction(creator, "account", "UPDATE_ACCOUNT"),
      "account"
    )
  );
}

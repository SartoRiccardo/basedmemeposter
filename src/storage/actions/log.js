import axios from "axios";
import { getToken } from "../session";
import { callIfSuccessful, protectFunction, makeAction } from "../../util/control";

/**
 * Requests logs with the specific parameter.
 * @param  {Object} params  An object containing the search params.
 */
export function fetchLogs(params=null) {
  const creator = async function(dispatch, actionId, getState) {
    const { REACT_APP_BACKEND } = process.env;
    const config = {
      params: params || {},
      headers: { "Authorization": `Bearer ${getToken()}` },
    };

    const { data } = await axios.get(`${REACT_APP_BACKEND}/logs`, config);

    if(actionId === getState().log.lastLoad) {
      dispatch({
        type: "SET_LOGS",
        count: data.data.level_count,
        filtered: 100,
        logs: data.data.data,
      });
    }
  }

  return protectFunction(makeAction(creator, "log", "SET_LOGS"));
}

export function ignoreLogs(level, amount) {
  const creator = async function(dispatch) {
    const { REACT_APP_BACKEND } = process.env;
    const config = {
      params: { level, amount },
      headers: { "Authorization": `Bearer ${getToken()}` },
    };
    const response = await axios.put(`${REACT_APP_BACKEND}/logs/ignore`, null, config);

    dispatch({ type: "IGNORE_LOGS", level, amount });
  }

  return protectFunction(makeAction(creator, "log", `IGNORE_LOGS_${level.toUpperCase()}`));
}

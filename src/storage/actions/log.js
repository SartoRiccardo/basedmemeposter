import axios from "axios";
import { callIfSuccessful, protectFunction, makeAction } from "../../util/control";

const someAccount = {id:1, username:"basedmemeposter", startTime:"10:00:00", endTime:"21:00:00", avatar:"https://instagram.fmxp6-1.fna.fbcdn.net/v/t51.2885-19/s150x150/88916645_2488601074737569_9207978216935915520_n.jpg?_nc_ht=instagram.fmxp6-1.fna.fbcdn.net&_nc_ohc=KNW0WNrTHkIAX-tgkUS&oh=10d17c1bc23ee90be33835514b31a120&oe=5E9DFD60"};
const dummyLogs = [
  {id: 40, date: "2020-03-19 19:34:53", level: "warning", account: {...someAccount}, message: "Did not cancel Reactivate popup"},
  {id: 84, date: "2020-03-19 19:35:17", level: "warning", account: {...someAccount}, message: "Did not cancel Add to Home popup"},
  {id: 73, date: "2020-03-19 19:35:29", level: "info", account: {...someAccount}, message: "Opened the file menu"},
  {id: 78, date: "2020-03-19 19:35:44", level: "info", account: {...someAccount}, message: "Submitted image"},
  {id: 64, date: "2020-03-19 19:35:50", level: "info", account: {...someAccount}, message: "Wrote caption"},
  {id: 44, date: "2020-03-19 19:35:59", level: "info", account: {...someAccount}, message: "Shared image"},
];
const dummyCount = {
  debug: 0,
  info: 0,
  warning: 50,
  error: 10,
  critical: 0,
};

/**
 * Requests logs with the specific parameter.
 * @param  {Object} params  An object containing the search params.
 */
export function fetchLogs(params=null) {
  const creator = async function(dispatch, actionId, getState) {
    try {
      // const { REACT_APP_BACKEND } = process.env;
      // const config = {
      //   params: params || {},
      // };
      //
      // const response = await axios.get(`${REACT_APP_BACKEND}/logs`, config);

      // Simulate a request
      const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");

      callIfSuccessful(response, () => {
        if(actionId === getState().log.lastLoad) {
          dispatch({
            type: "SET_LOGS",
            count: dummyCount,
            filtered: 100,
            logs: dummyLogs,
          });
        }
      }, (error) => {
        dispatch({ type: "ERROR", store: "log", error: error.title });
      });
    }
    catch(e) {
      dispatch({ type: "ERROR", store: "log", error: e.message });
    }
  }

  return protectFunction(makeAction(creator, "log", "SET_LOGS"));
}

export function ignoreLogs(level, amount) {
  const creator = async function(dispatch) {
    try {
      // Simulate a request
      const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");

      callIfSuccessful(response, () => {
        dispatch({ type: "IGNORE_LOGS", level, amount });
      }, (error) => {
        dispatch({ type: "ERROR", store: "log", error: error.title });
      });
    }
    catch(e) {
      dispatch({ type: "ERROR", store: "log", error: e.message });
    }
  }

  return protectFunction(makeAction(creator, "log", `IGNORE_LOGS_${level.toUpperCase()}`));
}

export function initIgnoredLogs() {
  const creator = async function (dispatch, level) {
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");

      callIfSuccessful(response, () => {
        const amount = 5;
        dispatch({ type: "IGNORE_LOGS", level, amount });
      }, (error) => {
        dispatch({ type: "ERROR", store: "log", error: error.title });
      });
    }
    catch(e) {
      dispatch({ type: "ERROR", store: "log", error: e.message });
    }
  }

  const loadForAll = async function(dispatch) {
    const levels = ["warning", "error"];
    await Promise.all(levels.map(async (l) => await creator(dispatch, l)));
  }

  return protectFunction(makeAction(loadForAll, "log", "GET_IGNORED_LOGS"));
}

import { combineReducers } from "redux";
import statusReducer from "./status";
import accountReducer from "./account";
import scheduleReducer from "./schedule";
import logReducer from "./log";

const rootReducer = combineReducers({
  status: statusReducer,
  account: accountReducer,
  schedule: scheduleReducer,
  log: logReducer,
});

export default rootReducer;

import { combineReducers } from "redux";
import statusReducer from "./status";
import accountReducer from "./account";
import scheduleReducer from "./schedule";
import logReducer from "./log";
import authReducer from "./auth";

const rootReducer = combineReducers({
  status: statusReducer,
  account: accountReducer,
  schedule: scheduleReducer,
  log: logReducer,
  auth: authReducer,
});

export default rootReducer;

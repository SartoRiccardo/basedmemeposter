import { combineReducers } from "redux";
import statusReducer from "./status";
import accountReducer from "./account";
import scheduleReducer from "./schedule";
import logReducer from "./log";
import authReducer from "./auth";
import captionReducer from "./caption";

const rootReducer = combineReducers({
  status: statusReducer,
  account: accountReducer,
  schedule: scheduleReducer,
  log: logReducer,
  auth: authReducer,
  caption: captionReducer,
});

export default rootReducer;

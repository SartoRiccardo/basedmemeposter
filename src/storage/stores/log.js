
const levels = ["debug", "info", "warning", "error", "critical"];
let count = {};
for(const l of levels) {
  count[l] = 0;
}

/**
 * The initial state of the log reducer.
 * @prop {string[]} levels  A constant listing the available log levels.
 * @prop {Object}   count   The total amount of each log type.
 * @prop {Log[]}    logs    The logs for that account.
 */
const init = {
  levels,
  count,
  ignored: {
    warning: 0,
    error: 0,
  },
  logs: [],
};

function logReducer(state=init, action) {
  switch(action.type) {
    case "SET_LOGS":
      return {
        ...state,
        account: action.account,
        count: action.count,
        logs: action.logs,
      };

    case "RESET_LOGS":
      return init;

    case "IGNORE_LOGS":
      return {
        ...state,
        ignored: {
          ...state.ignored,
          [ action.level ]: action.amount,
        },
      };

    default:
      return state;
  }
}

export default logReducer;

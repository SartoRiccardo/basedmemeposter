
/**
 * The initial state of the log reducer.
 * @prop {int}   account  The account ID.
 * @prop {Log[]} logs     The logs for that account.
 */
const init = {
  account: null,
  logs: [],
};

function logReducer(state=init, action) {
  switch(action.type) {
    case "SET_LOGS":
      return {
        ...state,
        account: action.account,
        logs: action.logs,
      };

    case "RESET_LOGS":
      return init;

    default:
      return state;
  }
}

export default logReducer;

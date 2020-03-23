
/**
 * The initial state of the status state.
 * @prop {string[]} accounts     The list of loaded accounts.
 */
const init = {
  accounts: [],
};

function accountReducer(state=init, action) {
  switch(action.type) {
    case "SET_ACCOUNTS":
      return {
        ...state,
        accounts: action.accounts,
      };

    case "RESET_ACCOUNTS":
      return init;

    default:
      return state;
  }
}

export default accountReducer;

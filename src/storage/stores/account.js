
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

    case "SET_ACCOUNT_IMAGE":
      return {
        ...state,
        accounts: state.accounts.map(account => {
          if(account.id !== action.accountId) return account;

          return {
            ...account,
            avatar: action.avatar,
          };
        }),
      }

    case "ADD_ACCOUNT":
      return {
        ...state,
        accounts: [ ...state.accounts, action.account ],
      };

    case "UPDATE_ACCOUNT":
      return {
        ...state,
        accounts: state.accounts.map(
          stateAccount => stateAccount.id === action.account.id
              ? action.account : stateAccount
        ),
      }

    default:
      return state;
  }
}

export default accountReducer;

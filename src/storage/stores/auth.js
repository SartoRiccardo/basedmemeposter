
const init = {
  token: null,
};

function authReducer(state=init, action) {
  switch(action.type) {
    case "SET_AUTH":
      return {
        ...state,
        token: action.anonymous ? null : action.token,
      };

    case "RESET_AUTH":
      return {
        ...state,
        token: null,
      };

    default:
      return state;
  }
}

export default authReducer;


/**
 * The initial state of the schedule reducer.
 * @prop {int}   account   The account ID.
 * @prop {Log[]} schedule  The account's schedule.
 */
const init = {
  account: null,
  schedule: [],
};

function logReducer(state=init, action) {
  switch(action.type) {
    case "SET_SCHEDULES":
      return {
        ...state,
        account: action.account,
        schedule: action.logs,
      };

    case "RESET_SCHEDULES":
      return init;

    default:
      return state;
  }
}

export default logReducer;

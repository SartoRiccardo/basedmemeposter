
/**
 * The initial state of the schedule reducer.
 * @prop {int}        account   The account ID.
 * @prop {Schedule[]} schedule  The account's schedule.
 */
const init = {
  account: null,
  schedule: [],
};

function scheduleReducer(state=init, action) {
  switch(action.type) {
    case "SET_SCHEDULES":
      return {
        ...state,
        account: action.account,
        schedule: action.schedule,
      };

    case "RESET_SCHEDULES":
      return init;

    case "DELETE_SCHEDULED_POST":
      return {
        ...state,
        schedule: state.schedule.filter((s) => s.id !== action.postId),
      };

    default:
      return state;
  }
}

export default scheduleReducer;

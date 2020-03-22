
/**
 * The initial state of the schedule reducer.
 * @prop {int}        account   The account ID.
 * @prop {Schedule[]} schedule  The account's schedule.
 */
const init = {
  account: 1,
  // schedule: [],
  schedule: [
    {id:1, date:"2020-03-22 15:30:00", account:1,
        post: {id:1, platform:"IMGUR", originalId:"9wKX9ST", dateAdded:"2020-03-22 00:00:00",
              originalLink: "https://imgur.com/gallery/9wKX9ST",
              thumbnail:"https://i.imgur.com/8RaGcqf_d.jpg?maxwidth=520&shape=thumb&fidelity=high"}},
    {id:2, date:"2020-03-22 16:00:00", account:1,
        post: {id:1, platform:"IMGUR", originalId:"ScF87uJ", dateAdded:"2020-03-22 00:01:00",
              originalLink: "https://imgur.com/gallery/ScF87uJ",
              thumbnail:"https://i.imgur.com/2IUEtLZ_d.jpg?maxwidth=520&shape=thumb&fidelity=high"}},
    {id:8, date:"2020-03-25 17:43:00", account:1,
        post: {id:1, platform:"IMGUR", originalId:"bg1sAw0", dateAdded:"2020-03-22 00:01:00",
              originalLink: "https://imgur.com/gallery/bg1sAw0",
              thumbnail:"https://i.imgur.com/MFfUvqN_d.jpg?maxwidth=520&shape=thumb&fidelity=high"}},
  ],
};

function scheduleReducer(state=init, action) {
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

export default scheduleReducer;

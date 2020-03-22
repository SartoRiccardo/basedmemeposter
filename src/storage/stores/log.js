
const someAccount = {id:1, username:"basedmemeposter", startTime:"10:00:00", endTime:"21:00:00", avatar:"https://instagram.fmxp6-1.fna.fbcdn.net/v/t51.2885-19/s150x150/88916645_2488601074737569_9207978216935915520_n.jpg?_nc_ht=instagram.fmxp6-1.fna.fbcdn.net&_nc_ohc=KNW0WNrTHkIAX-tgkUS&oh=10d17c1bc23ee90be33835514b31a120&oe=5E9DFD60"};

/**
 * The initial state of the log reducer.
 * @prop {string[]} levels  A constant listing the available log levels.
 * @prop {Log[]}    logs    The logs for that account.
 */
const init = {
  levels: ["debug", "info", "warning", "error", "critical"],
  // logs: [],
  logs: [
    {id: 40, date: "2020-03-19 19:34:53", level: "warning", account: {...someAccount}, message: "Did not cancel Reactivate popup"},
    {id: 84, date: "2020-03-19 19:35:17", level: "warning", account: {...someAccount}, message: "Did not cancel Add to Home popup"},
    {id: 73, date: "2020-03-19 19:35:29", level: "info", account: {...someAccount}, message: "Opened the file menu"},
    {id: 78, date: "2020-03-19 19:35:44", level: "info", account: {...someAccount}, message: "Submitted image"},
    {id: 64, date: "2020-03-19 19:35:50", level: "info", account: {...someAccount}, message: "Wrote caption"},
    {id: 44, date: "2020-03-19 19:35:59", level: "info", account: {...someAccount}, message: "Shared image"},
  ],
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

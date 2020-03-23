import axios from "axios";
import { callIfSuccessful, protectFunction, makeAction } from "../../util/control";

const dummySchedule = [
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
];

export function loadScheduleFor(account) {
  const creator = async function(dispatch) {
    try {
      // const { REACT_APP_BACKEND } = process.env;
      // const response = await axios.get(`${REACT_APP_BACKEND}/accounts/${user}/schedule?showOnlyScheduled`);

      // Simulate a request
      const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");

      callIfSuccessful(response, () => {
        dispatch({
          type: "SET_SCHEDULES",
          account: account,
          schedule: dummySchedule,
        });
      }, (error) => {
        dispatch({ type: "ERROR", store: "schedule", error: error.title });
      });
    }
    catch(e) {
      dispatch({ type: "ERROR", store: "schedule", error: e.message });
    }
  }

  return protectFunction(makeAction(creator, "schedule", "SET_SCHEDULES"));
}

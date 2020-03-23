import axios from "axios";
import { callIfSuccessful, protectFunction, makeAction } from "../../util/control";

const dummyAccounts = [
  {id:1, username:"basedmemeposter", startTime:"10:00:00", endTime:"21:00:00", avatar:"https://instagram.fmxp6-1.fna.fbcdn.net/v/t51.2885-19/s150x150/88916645_2488601074737569_9207978216935915520_n.jpg?_nc_ht=instagram.fmxp6-1.fna.fbcdn.net&_nc_ohc=KNW0WNrTHkIAX-tgkUS&oh=10d17c1bc23ee90be33835514b31a120&oe=5E9DFD60"},
  {id:2, username:"swokkkkkkkkkkkk", startTime:"12:00:00", endTime:"23:00:00", avatar:"https://instagram.fmxp6-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/90028426_1113421348993810_5030765985888444168_n.jpg?_nc_ht=instagram.fmxp6-1.fna.fbcdn.net&_nc_cat=110&_nc_ohc=4bW7UxeuzGQAX8-AHDi&oh=150d3a697cf26b1c8411eae7c117e1bf&oe=5E9D8A1B"},
  {id:5, username:"epic.chungus.keanu", startTime:"22:00:00", endTime:"06:00:00", avatar:"https://instagram.fmxp6-1.fna.fbcdn.net/v/t51.2885-19/s150x150/84354342_329057798041933_2548586232842027008_n.jpg?_nc_ht=instagram.fmxp6-1.fna.fbcdn.net&_nc_ohc=TAX_nnvp6c8AX-2UTRl&oh=d27d5e3bf29703d933fb39d752eedcc7&oe=5E9DB759"},
];

export function fetchAccounts() {
  const creator = async function(dispatch) {
    try {
      // const { REACT_APP_BACKEND } = process.env;
      // const response = await axios.get(`${REACT_APP_BACKEND}/accounts`);

      // Simulate a request
      const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");

      callIfSuccessful(response, () => {
        dispatch({
          type: "SET_ACCOUNTS",
          accounts: dummyAccounts,
        });
      }, (error) => {
        dispatch({ type: "ERROR", store: "account", error: error.title });
      });
    }
    catch(e) {
      dispatch({ type: "ERROR", store: "account", error: e.message });
    }
  }

  return protectFunction(makeAction(creator, "account", "SET_ACCOUNTS"));
}

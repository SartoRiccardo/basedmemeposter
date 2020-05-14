import axios from "axios";
import { getToken } from "../session";
import { protectFunction, makeAction } from "../../util/control";

export function loadScheduleFor(account) {
  const creator = async function(dispatch) {
    const { REACT_APP_BACKEND } = process.env;
    const config = {
      params: { account, onlyScheduled: true },
      headers: { "X-Authorization": `Bearer ${getToken()}` },
    };
    const response = await axios.get(`${REACT_APP_BACKEND}/schedule`, config);

    dispatch({
      type: "SET_SCHEDULES",
      account: account,
      schedule: response.data.data,
    });
  }

  return protectFunction(makeAction(creator, "schedule", "SET_SCHEDULES"));
}

export function cancelScheduledPost(id) {
  const creator = async function(dispatch) {
    const { REACT_APP_BACKEND } = process.env;
    const config = {
      headers: { "X-Authorization": `Bearer ${getToken()}` },
    };
    await axios.delete(`${REACT_APP_BACKEND}/schedule/${id}`, config);

    dispatch({ type: "DELETE_SCHEDULED_POST", postId: id });
  }

  return protectFunction(makeAction(creator, "schedule", "DELETE_SCHEDULE"));
}

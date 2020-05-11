import axios from "axios";
import { getToken } from "../session";
import { callIfSuccessful, protectFunction, makeAction } from "../../util/control";

const dummySources = [{name:"lordcoola", platform:"instagram"},{name:"salad.snake", platform:"instagram"},{name:"nightmarepetrol", platform:"twitter"},{name:"apandahVEVO", platform:"twitter"},{name:"lilshpee", platform:"twitter"},{name:"pewdiepiesubmissions", platform:"reddit"},{name:"chonkers", platform:"reddit"},].map((obj, id)=>({id,...obj}));

export function fetchSources() {
  const creator = async function(dispatch) {
    const { REACT_APP_BACKEND } = process.env;
    const config = {
      headers: { "Authorization": `Bearer ${getToken()}` },
    };
    const response = await axios.get(`${REACT_APP_BACKEND}/sources`, config);

    dispatch({ type: "SET_SOURCES", sources: response.data.data });
  }

  return protectFunction(makeAction(creator, "source", "SET_SOURCES"));
}

export function deleteSource(id) {
  const creator = async function(dispatch) {
    const { REACT_APP_BACKEND } = process.env;
    const config = {
      headers: { "Authorization": `Bearer ${getToken()}` },
    };
    const response = await axios.delete(`${REACT_APP_BACKEND}/sources/${id}`, config);

    dispatch({ type: "DELETE_SOURCE", source: id });
  }

  const extraParams = { source: id };
  return protectFunction(makeAction(creator, "source", "DELETE_SOURCE", extraParams));
}

export function updateSource(source) {
  const creator = async function(dispatch) {
    const { REACT_APP_BACKEND } = process.env;
    const config = {
      headers: { "Authorization": `Bearer ${getToken()}` },
    };
    const response = await axios.put(`${REACT_APP_BACKEND}/sources/${source.id}`, source, config);

    dispatch({ type: "UPDATE_SOURCE", source });
  }

  const extraParams = { source: source.id };
  return protectFunction(makeAction(creator, "source", "UPDATE_SOURCE", extraParams));
}

export function addSource(source) {
  const creator = async dispatch => {
    const { REACT_APP_BACKEND } = process.env;
    const config = {
      headers: { "Authorization": `Bearer ${getToken()}` },
    };
    const response = await axios.post(`${REACT_APP_BACKEND}/sources`, source, config);

    dispatch({ type: "ADD_SOURCE", source: { ...response.data.data } });
  }

  return protectFunction(makeAction(creator, "source", "ADD_SOURCE"));
}

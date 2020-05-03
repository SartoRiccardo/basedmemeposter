import axios from "axios";
import { callIfSuccessful, protectFunction, makeAction } from "../../util/control";

const dummySources = [{name:"lordcoola", platform:"instagram"},{name:"salad.snake", platform:"instagram"},{name:"nightmarepetrol", platform:"twitter"},{name:"apandahVEVO", platform:"twitter"},{name:"lilshpee", platform:"twitter"},{name:"pewdiepiesubmissions", platform:"reddit"},{name:"chonkers", platform:"reddit"},].map((obj, id)=>({id,...obj}));

export function fetchSources() {
  const creator = async function(dispatch) {
    try {
      // const { REACT_APP_BACKEND } = process.env;
      // const response = await axios.get(`${REACT_APP_BACKEND}/sources`);

      // Simulate a request
      const response = await axios.get("http://localhost:3000");

      callIfSuccessful(response,
        () => dispatch({ type: "SET_SOURCES", sources: dummySources }),
        (error) => dispatch({ type: "ERROR", store: "source", error: error.title })
      );
    }
    catch(e) {
      dispatch({ type: "ERROR", store: "source", error: e.message });
    }
  }

  return protectFunction(makeAction(creator, "source", "SET_SOURCES"));
}

export function deleteSource(id) {
  const creator = async function(dispatch) {
    try {
      // const { REACT_APP_BACKEND } = process.env;
      // const response = await axios.delete(`${REACT_APP_BACKEND}/sources/${id}`);

      // Simulate a request
      const response = await axios.get("http://localhost:3000");

      callIfSuccessful(response,
        () => dispatch({ type: "DELETE_SOURCE", source: id }),
        (error) => dispatch({ type: "ERROR", store: "source", error: error.title })
      );
    }
    catch(e) {
      dispatch({ type: "ERROR", store: "source", error: e.message });
    }
  }

  const extraParams = { source: id };
  return protectFunction(makeAction(creator, "source", "DELETE_SOURCE", extraParams));
}

export function updateSource(source) {
  const creator = async function(dispatch) {
    try {
      // const { REACT_APP_BACKEND } = process.env;
      // const response = await axios.put(`${REACT_APP_BACKEND}/sources/${source.id}`);

      // Simulate a request
      const response = await axios.get("http://localhost:3000");

      callIfSuccessful(response,
        () => dispatch({ type: "UPDATE_SOURCE", source }),
        (error) => dispatch({ type: "ERROR", store: "source", error: error.title })
      );
    }
    catch(e) {
      dispatch({ type: "ERROR", store: "source", error: e.message });
    }
  }

  const extraParams = { source: source.id };
  return protectFunction(makeAction(creator, "source", "UPDATE_SOURCE", extraParams));
}

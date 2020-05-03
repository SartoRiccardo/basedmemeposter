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

export function addSource(source) {
  const creator = async dispatch => {
    try {
      // const { REACT_APP_BACKEND } = process.env;
      // const response = await axios.post(`${REACT_APP_BACKEND}/sources`, source);

      // Simulate a request
      const response = await axios.get("http://localhost:3000");

      callIfSuccessful(
        response,
        () => {
          // Some ID that's given from the server
          const someId = Math.floor(Math.random()*1000)+100;
          dispatch({ type: "ADD_SOURCE", source: { id: someId, ...source } });
        },
        error => dispatch({ type: "ERROR", store: "source", error: error.title })
      )
    }
    catch(e) {
      dispatch({ type: "ERROR", store: "source", error: e.message });
    }
  }

  return protectFunction(makeAction(creator, "source", "ADD_SOURCE"));
}

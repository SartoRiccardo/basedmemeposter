import axios from "axios";
import { callIfSuccessful, protectFunction, makeAction } from "../../util/control";

const dummyCaptions = ["lol", "me irl", "based", "hahahah", "random caption", "", "aoeuhouaevouageovgaeogvoaegvobaevhoayeoaoaeayevaeoavpavpaepuvaepvapevpaebvepauvpaevpavepevapapevpa", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "che pirla", "e no non si fa cosi"]
    .map((text, id) => ({ text, id }));

export function fetchCaptions(page) {
  const creator = async dispatch => {
    try {
      // const { REACT_APP_BACKEND } = process.env;
      // const config = {
      //   params: { page },
      // };
      // const response = await axios.get(`${REACT_APP_BACKEND}/captions`, config);

      // Simulate a request
      const response = await axios.get("http://localhost:3000");

      callIfSuccessful(
        response,
        () => {
          dispatch({ type: "SET_PAGE", page });
          dispatch({ type: "SET_CAPTIONS", captions: dummyCaptions, count: 500 });
        },
        error => dispatch({ type: "ERROR", store: "caption", error: error.title })
      )
    }
    catch(e) {
      dispatch({ type: "ERROR", store: "caption", error: e.message });
    }
  }

  return protectFunction(makeAction(creator, "caption", "SET_CAPTIONS"));
}

export function deleteCaption(id) {
  const creator = async dispatch => {
    try {
      // const { REACT_APP_BACKEND } = process.env;
      // const response = await axios.delete(`${REACT_APP_BACKEND}/captions/${id}`);

      // Simulate a request
      const response = await axios.get("http://localhost:3000");

      callIfSuccessful(
        response,
        () => {
          dispatch({ type: "DELETE_CAPTION", caption: id });
        },
        error => dispatch({ type: "ERROR", store: "caption", error: error.title })
      )
    }
    catch(e) {
      dispatch({ type: "ERROR", store: "caption", error: e.message });
    }
  }

  const extraParams = { caption: id };
  return protectFunction(makeAction(creator, "caption", "DELETE_CAPTION", extraParams));
}

export function changeCaption(caption) {
  const creator = async dispatch => {
    try {
      // const { REACT_APP_BACKEND } = process.env;
      // const response = await axios.put(`${REACT_APP_BACKEND}/captions/${caption.id}`, caption);

      // Simulate a request
      const response = await axios.get("http://localhost:3000");

      callIfSuccessful(
        response,
        () => {
          dispatch({ type: "CHANGE_CAPTION", caption });
        },
        error => dispatch({ type: "ERROR", store: "caption", error: error.title })
      )
    }
    catch(e) {
      dispatch({ type: "ERROR", store: "caption", error: e.message });
    }
  }

  const extraParams = { caption: caption.id };
  return protectFunction(makeAction(creator, "caption", "CHANGE_CAPTION", extraParams));
}

export function addCaption(caption) {
  const creator = async dispatch => {
    try {
      // const { REACT_APP_BACKEND } = process.env;
      // const response = await axios.post(`${REACT_APP_BACKEND}/captions/${caption.id}`, caption);

      // Simulate a request
      const response = await axios.get("http://localhost:3000");

      callIfSuccessful(
        response,
        () => {
          // Some ID that's given from the server
          const someId = Math.floor(Math.random()*1000)+100;
          dispatch({ type: "ADD_CAPTION", caption: { id: someId, ...caption } });
        },
        error => dispatch({ type: "ERROR", store: "caption", error: error.title })
      )
    }
    catch(e) {
      dispatch({ type: "ERROR", store: "caption", error: e.message });
    }
  }

  return protectFunction(makeAction(creator, "caption", "ADD_CAPTION"));
}

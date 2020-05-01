import axios from "axios";
import { callIfSuccessful, protectFunction, makeAction } from "../../util/control";
import { getUserAvatar } from "../../util/instagram";

const dummyCaptions = ["lol", "me irl", "based", "hahahah", "random caption", "", "aoeuhouaevouageovgaeogvoaegvobaevhoayeoaoaeayevaeoavpavpaepuvaepvapevpaebvepauvpaevpavepevapapevpa", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "che pirla", "e no non si fa cosi"]
    .map((text, id) => ({ text, id }));

export function fetchCaptions(page) {
  const creator = async dispatch => {
    try {
      // const { REACT_APP_BACKEND } = process.env;
      const config = {
        params: { page },
      };
      // const response = await axios.get(`${REACT_APP_BACKEND}/captions`, config);

      // Simulate a request
      const response = await axios.get("http://localhost:3000");

      callIfSuccessful(
        response,
        () => {
          dispatch({ type: "SET_PAGE", page });
          dispatch({ type: "SET_CAPTIONS", captions: dummyCaptions });
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

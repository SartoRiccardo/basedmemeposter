import axios from "axios";
import { getToken } from "../session";
import { protectFunction, makeAction } from "../../util/control";

export function fetchCaptions(page) {
  const creator = async dispatch => {
    const { REACT_APP_BACKEND } = process.env;
    const config = {
      params: { page },
      headers: { "Authorization": `Bearer ${getToken()}` },
    };
    const { data } = await axios.get(`${REACT_APP_BACKEND}/captions`, config);

    const captions = data.data.data; // damn
    dispatch({ type: "SET_PAGE", page });
    dispatch({
      type: "SET_CAPTIONS",
      captions,
      count: data.data.total,
      perPage: data.data.per_page,
    });
  }

  return protectFunction(makeAction(creator, "caption", "SET_CAPTIONS"));
}

export function deleteCaption(id) {
  const creator = async dispatch => {
    const { REACT_APP_BACKEND } = process.env;
    const config = {
      headers: { "Authorization": `Bearer ${getToken()}` },
    };
    await axios.delete(`${REACT_APP_BACKEND}/captions/${id}`, config);
    dispatch({ type: "DELETE_CAPTION", caption: id });
  }

  const extraParams = { caption: id };
  return protectFunction(makeAction(creator, "caption", "DELETE_CAPTION", extraParams));
}

export function changeCaption(caption) {
  const creator = async dispatch => {
    const { REACT_APP_BACKEND } = process.env;
    const config = {
      headers: { "Authorization": `Bearer ${getToken()}` },
    };
    await axios.put(`${REACT_APP_BACKEND}/captions/${caption.id}`, caption, config);

    dispatch({ type: "CHANGE_CAPTION", caption });
  }

  const extraParams = { caption: caption.id };
  return protectFunction(makeAction(creator, "caption", "CHANGE_CAPTION", extraParams));
}

export function addCaption(caption) {
  const creator = async dispatch => {
    const { REACT_APP_BACKEND } = process.env;
    const config = {
      headers: { "Authorization": `Bearer ${getToken()}` },
    };
    const response = await axios.post(`${REACT_APP_BACKEND}/captions`, caption, config);

    dispatch({ type: "ADD_CAPTION", caption: { ...response.data.data } });
  }

  return protectFunction(makeAction(creator, "caption", "ADD_CAPTION"));
}

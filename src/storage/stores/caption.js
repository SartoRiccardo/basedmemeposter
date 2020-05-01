
const init = {
  captions: [],
  page: null,
};

function captionReducer(state=init, action) {
  switch(action.type) {
    case "SET_CAPTIONS":
      return {
        ...state,
        captions: action.captions,
      };

    case "SET_PAGE":
      return {
        ...state,
        page: action.page,
      }

    default:
      return state;
  }
}

export default captionReducer;


const init = {
  captions: [],
  count: 0,
  page: null,
};

function captionReducer(state=init, action) {
  switch(action.type) {
    case "SET_CAPTIONS":
      return {
        ...state,
        captions: action.captions,
        count: action.count,
      };

    case "SET_PAGE":
      return {
        ...state,
        page: action.page,
      };

    case "DELETE_CAPTION":
      return {
        ...state,
        captions: state.captions.filter(
          caption => caption.id !== action.caption
        ),
      };

    case "CHANGE_CAPTION":
      return {
        ...state,
        captions: state.captions.map(
          caption => caption.id === action.caption.id ? action.caption : caption
        ),
      };

    default:
      return state;
  }
}

export default captionReducer;

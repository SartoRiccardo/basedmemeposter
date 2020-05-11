
const init = {
  sources: [],
};

function sourceReducer(state=init, action) {
  switch(action.type) {
    case "SET_SOURCES":
      return {
        ...state,
        sources: action.sources,
      };

    case "DELETE_SOURCE":
      return {
        ...state,
        sources: state.sources.filter(source => source.id !== action.source),
      };

    case "UPDATE_SOURCE":
      return {
        ...state,
        sources: state.sources.map(
          source => source.id !== action.source.id ? source : action.source
        ),
      };

    case "ADD_SOURCE":
      return {
        ...state,
        sources: [ ...state.sources, action.source ]
      }

    default:
      return state;
  }
}

export default sourceReducer;

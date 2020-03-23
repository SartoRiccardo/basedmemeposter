
/**
 * The initial state of the any state.
 * @prop {boolean}  initialized  Whether the state has been initialized.
 * @prop {string[]} errors       Any errors that happened.
 * @prop {boolean}  dumping      Whether someone keeps dumping actions.
 * @prop {int[]}    actions      The IDs of the unresolved actions.
 */
const initialState = {
  initialized: false,
  errors: [],
  dumping: false,
  actions: [],
};

const init = {
  account: {...initialState},
  schedule: {...initialState},
  log: {...initialState},
};

function statusReducer(state=init, action) {
  const { type } = action;
  let matches, store;

  matches = type.match(/(?:^SET_(.+)S|^RESET_(.+)S)/gm);
  if(matches) {
    store = matches[0].toLowerCase();
    return {
      ...state,
      [ store ]: {
        ...state[store],
        initialized: type.startsWith("SET_"),
      },
    };
  }

  store = action.store;
  switch(action.type) {
    case "START_DUMP":
      return {
        ...state,
        [ store ]: {
          ...state[store],
          dumping: true,
        },
      };

    case "END_DUMP":
      return {
        ...state,
        [ store ]: {
          ...state[store],
          dumping: false,
        },
      };

    case "START_ACTION":
      return {
        ...state,
        [ store ]: {
          ...state[store],
          actions: [ ...state[store].actions, action.id ],
        },
      };

    case "END_ACTION":
      return {
        ...state,
        [ store ]: {
          ...state[store],
          actions: state[store].actions.filter((id) => id !== action.id),
        },
      };

    default:
      return state;
  }
}

export default statusReducer;


/**
 * The initial state of the any state.
 * @prop {boolean}  initialized  Whether the state has been initialized.
 * @prop {string[]} errors       Any errors that happened.
 * @prop {boolean}  dumping      Whether someone keeps dumping actions.
 * @prop {Action[]} actions      The IDs of the unresolved actions.
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

  matches = /(?:^SET_(.+)S|^RESET_(.+)S)/gm.exec(type);
  if(matches) {
    store = matches[1].toLowerCase();
    return {
      ...state,
      [ store ]: {
        ...state[store],
        initialized: type.startsWith("SET_"),
      },
    };
  }

  store = action.store;
  switch(type) {
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
          actions: [
            ...state[store].actions,
            { id: action.id, type: action.futureAction },
          ],
        },
      };

    case "END_ACTION":
      return {
        ...state,
        [ store ]: {
          ...state[store],
          actions: state[store].actions.filter((a) => a.id !== action.id),
        },
      };

    case "ERROR":
      return {
        ...state,
        [ store ]: {
          ...state[store],
          errors: [ ...state[store].errors, action.error ],
        },
      };

    default:
      return state;
  }
}

export default statusReducer;

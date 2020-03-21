
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
  let matches;

  matches = type.match(/(?:START_DUMP_(.+)|END_DUMP_(.+))/gm);
  if(matches) {
    const index = matches[0].toLowerCase();
    return {
      ...state,
      [ index ]: {
        ...state[index],
        dumping: type.includes("START_DUMP_"),
      },
    };
  }

  matches = type.match(/(?:START_ACTION_(.+)|END_ACTION_(.+))/gm);
  if(matches) {
    const index = matches[0].toLowerCase();
    let newActions;
    if(type.includes("START_ACTION_")) {
      newActions = [...state[index].dumping, action.id];
    }
    else {
      newActions = state[index].dumping.filter((id) => {
        return id !== action.id;
      });
    }

    return {
      ...state,
      [ index ]: {
        ...state[index],
        actions: newActions,
      },
    };
  }

  matches = type.match(/(?:^SET_(.+)S|^RESET_(.+)S)/gm);
  if(matches) {
    const index = matches[0].toLowerCase();
    return {
      ...state,
      [ index ]: {
        ...state[index],
        initialized: type.startsWith("SET_"),
      },
    };
  }

  return state;
}

export default statusReducer;

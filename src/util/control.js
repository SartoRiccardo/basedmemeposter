import { getToken } from "../storage/session";

export function protectFunction(callback) {
  return function() {
    if(!getToken()) {
      return;
    }
    callback.apply(this, arguments);
  }
}

export function makeAction(callback, store, futureAction, extraParams=null) {
  return async function() {
    const [ dispatch ] = arguments;

    const id = Math.random();
    if(extraParams === null) {
      extraParams = {};
    }
    dispatch({ ...extraParams, type:"START_ACTION", store, id, futureAction, });

    let newArguments = [ dispatchWithId(id, dispatch), id ];
    for(let i = 1; i < arguments.length; i++) {
      newArguments.push(arguments[i])
    }

    try {
      await callback.apply(this, newArguments);
    }
    catch(e) {
      const { response, message } = e;
      if(response && response.data.errors) {
        dispatch({ type: "ERROR", store, error: response.data.errors[0].title, id });
      }
      else {
        dispatch({ type: "ERROR", store, error: message, id });
      }
    }
    finally {
      dispatch({ type:"END_ACTION", store, id });
    }
  }
}

function dispatchWithId(id, dispatch) {
  return function() {
    let [ action ] = arguments;
    dispatch({ ...action, id });
  }
}

// eslint-disable-next-line
import { getToken } from "../storage/session";

export function callIfSuccessful(response, callback, onFail=null) {
  const { status, data } = response;

  if(200 <= status && status < 300) {
    callback();
  }
  else if(onFail) {
    onFail(data.errors || null);
  }
}

export function protectFunction(callback) {
  return function() {
    if(false) { // if(!getToken()) {
      return;
    }
    callback.apply(this, arguments);
  }
}

export function makeAction(callback, store, futureAction) {
  return async function() {
    const [ dispatch ] = arguments;

    const id = Math.random();
    dispatch({ type:"START_ACTION", store, id, futureAction });

    let newArguments = [ dispatchWithId(id, dispatch) ];
    for(let i = 1; i < arguments.length; i++) {
      newArguments.push(arguments[i])
    }
    await callback.apply(this, newArguments);

    dispatch({ type:"END_ACTION", store, id });
  }
}

function dispatchWithId(id, dispatch) {
  return function() {
    let [ action ] = arguments;
    dispatch({ ...action, id });
  }
}

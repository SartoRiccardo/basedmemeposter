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

export function makeAction(callback, store) {
  return async function() {
    const [ dispatch ] = arguments;

    const id = Math.random();
    dispatch({ type:"START_ACTION", store, id });
    await callback.apply(this, arguments);
    dispatch({ type:"END_ACTION", store, id });
  }
}

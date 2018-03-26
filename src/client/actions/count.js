import { INCREASE, DECREASE } from '../constants';

function increment(number) {
  return {
    type: INCREASE,
    amount: number || 1,
  };
}

function decrement(number) {
  return {
    type: DECREASE,
    amount: number || 1,
  };
}

export function incrementAction(number) {
  return dispatch => new Promise((resolve) => {
    setTimeout(() => {
      // Yay! Can invoke sync or async actions with `dispatch`
      dispatch(increment(number));
      resolve();
    }, 100);
  });
}

export function decrementAction(number) {
  return dispatch => new Promise((resolve) => {
    setTimeout(() => {
      // Yay! Can invoke sync or async actions with `dispatch`
      dispatch(decrement(number));
      resolve();
    }, 100);
  });
}

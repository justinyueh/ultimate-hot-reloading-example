import { SETHEADER, SETFOOTER } from '../constants';

function setHeader(html) {
  return {
    type: SETHEADER,
    html,
  };
}

function setFooter(html) {
  return {
    type: SETFOOTER,
    html,
  };
}

export function getHeaderAction() {
  return dispatch => new Promise((resolve) => {
    setTimeout(() => {
      // Yay! Can invoke sync or async actions with `dispatch`
      dispatch(setHeader('<div>header html</div>'));
      resolve();
    }, 10);
  });
}

export function getFooterAction() {
  return dispatch => new Promise((resolve) => {
    setTimeout(() => {
      // Yay! Can invoke sync or async actions with `dispatch`
      dispatch(setFooter('<div>footer</div>'));
      resolve();
    }, 10);
  });
}

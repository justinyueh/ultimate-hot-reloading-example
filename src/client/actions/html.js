import { SETHEADER, SETFOOTER, SETTITLE } from '../constants';

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

function setTitle(title) {
  return {
    type: SETTITLE,
    title,
  };
}

export function getHeaderAction() {
  return dispatch => new Promise((resolve) => {
    setTimeout(() => {
      // Yay! Can invoke sync or async actions with `dispatch`
      dispatch(setHeader('<div>header html here</div>'));
      resolve();
    }, 10);
  });
}

export function getFooterAction() {
  return dispatch => new Promise((resolve) => {
    setTimeout(() => {
      // Yay! Can invoke sync or async actions with `dispatch`
      dispatch(setFooter('<div>footer html here</div>'));
      resolve();
    }, 10);
  });
}

export function getTittleAction() {
  return dispatch => new Promise((resolve) => {
    setTimeout(() => {
      // Yay! Can invoke sync or async actions with `dispatch`
      dispatch(setTitle('React Server Render'));
      resolve();
    }, 10);
  });
}

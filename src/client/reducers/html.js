import { SETHEADER, SETFOOTER } from '../constants';

const initialState = {
  header: '',
  footer: '',
};

export default function html(state = initialState, action) {
  if (action.type === SETHEADER) {
    return {
      ...state,
      header: action.html,
    };
  } else if (action.type === SETFOOTER) {
    return {
      ...state,
      footer: action.html,
    };
  }
  return state;
}

import { SETHEADER, SETFOOTER, SETTITLE } from '../constants';

const initialState = {
  title: '',
  header: '',
  footer: '',
};

export default function html(state = initialState, action) {
  switch (action.type) {
    case SETTITLE:
      return {
        ...state,
        title: action.title,
      };
    case SETHEADER:
      return {
        ...state,
        header: action.html,
      };
    case SETFOOTER:
      return {
        ...state,
        footer: action.html,
      };
    default:
      return state;
  }
}

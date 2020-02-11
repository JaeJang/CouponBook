const PROCESSING = 'PROCESSING';
const PROCESSED = 'PROCESSED';
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

export const login = user => dispatch => {
  dispatch({ type: LOGIN, payload: user });
};

export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
};

const initialState = {
  isLoading: false,
  user: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROCESSING:
      return {
        ...state,
        isLoading: true
      };
    case PROCESSED:
      return {
        ...state,
        isLoading: false
      };
    case LOGIN:
      return {
        ...state,
        user: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}

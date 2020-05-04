export const SET_TO_ALERTS = 'SET_TO_ALERTS';
export const SET_FROM_ALERTS = 'SET_FROM_ALERTS';



export const updateToAlerts = alerts => dispatch => {
  dispatch({ type: SET_TO_ALERTS, payload: alerts });
};

export const updateFromAlerts = alerts => dispatch => {
  dispatch({ type: SET_FROM_ALERTS, payload: alerts });
};

const initialState = {
  toAlerts: {},
  fromAlerts: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_TO_ALERTS:
      return {
        ...state,
        toAlerts: action.payload
      };
    case SET_FROM_ALERTS:
      return {
        ...state,
        fromAlerts: action.payload
      }
    default:
      return state;
  }
}

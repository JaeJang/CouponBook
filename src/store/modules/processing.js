import { PROCESSING, PROCESSED } from '@store/types/loading';

export const processing = () => dispatch => {
  console.log(PROCESSING);
  dispatch({ type: PROCESSING });
};

export const processed = () => dispatch => {
  console.log(PROCESSED);
  dispatch({ type: PROCESSED });
};

const initialState = {
  isProcessing: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROCESSING:
      return { isProcessing: true };
    case PROCESSED:
      return { isProcessing: false };
    default:
      return state;
  }
}

import { Alert } from 'react-native';

import firebase from '../../configs/firebase';

import { LOGIN, LOGOUT } from '@store/types/authentication';
import { PROCESSING, PROCESSED } from '@store/types/loading';

import { processing, processed } from '@store/modules/processing';

export const login = (data, onSuccess) => dispatch => {
  dispatch(processing());
  firebase
    .auth()
    .signInWithEmailAndPassword(data.email, data.password)
    .then(() => {
      dispatch(processed());
      const user = firebase.auth().currentUser;
      if (!user.emailVerified) {
        Alert.alert('Log In', 'Please verify your email first and log in again!', [
          {
            text: 'OK'
          },
          {
            text: 'Resend',
            onPress: () => {
              dispatch(processing());
              user
                .sendEmailVerification()
                .then(() => {
                  dispatch(processed());
                  Alert.alert('Log In', 'We resent it! Please check your email.');
                })
                .catch(error => {
                  dispatch(processed());
                  Alert.alert('Log In', error.message);
                })
                .finally(() => {});
            }
          }
        ]);
      } else {
        dispatch({ type: LOGIN, payload: firebase.auth().currentUser });
        onSuccess();
      }
    })
    .catch(error => {
      dispatch(processed());
      Alert.alert('Log In', 'Incorrect Username or Password');
    });
  //.finally(() => dispatch(processed()));
};

export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
};

export const signup = (data, onSuccess, onFailed) => async dispatch => {
  dispatch({ type: PROCESSING });
  try {
    await firebase.auth().createUserWithEmailAndPassword(data.email, data.password);
  } catch (error) {
    dispatch({ type: PROCESSED });
    onFailed(error.message);
    return;
  }
  const user = firebase.auth().currentUser;
  user
    .updateProfile({
      displayName: data.firstName + data.lastName
    })
    .then(() => {
      user
        .sendEmailVerification()
        .then(() => {
          onSuccess();
        })
        .catch(error => {
          onFailed(error);
        });
    })
    .catch(error => {
      onFailed(error.message);
    })
    .finally(() => {
      dispatch({ type: PROCESSED });
      firebase.auth().signOut();
    });
};

const initialState = {
  isLoading: false,
  user: null
};

export default function(state = initialState, action) {
  switch (action.type) {
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

import { Alert } from 'react-native';

import firebase from '../../configs/firebase';

import * as ProfileService from '@service/ProfileService';
import { PROCESSING, PROCESSED } from '@store/types/loading';
import { processing, processed } from '@store/modules/processing';
import { updateToAlerts, updateFromAlerts } from '@modules/profile';
import { getSettings } from "../modules/profile";

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const login = (data, onSuccess) => dispatch => {
  dispatch(processing());
  firebase
    .auth()
    .signInWithEmailAndPassword(data.email, data.password)
    .then(() => {
      dispatch(processed());
      const user = firebase.getUser();
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
        ProfileService.getToAlerts(value => dispatch(updateToAlerts(value)));
        ProfileService.getFromAlerts(value => dispatch(updateFromAlerts(value)));
        dispatch(getSettings());
        dispatch({ type: LOGIN, payload: firebase.getUser() });
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
  const user = firebase.getUser();
  user
    .updateProfile({
      displayName: `${data.firstName}  ${data.lastName}`
    })
    .then(() => {
      firebase
        .getCUsersRef()
        .set({ email: data.email, name: `${data.firstName} ${data.lastName}` })
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
          user.delete();
        });
    })
    .catch(error => {
      onFailed(error.message);
      user.delete();
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

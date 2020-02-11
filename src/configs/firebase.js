import firebase from 'firebase';
import store from '../store';
import { login, logout } from '@modules/authentication';
import { firebaseConfig } from './configs';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.dispatch(login(user));
  } else {
    store.dispatch(logout());
  }
});

export default firebase;

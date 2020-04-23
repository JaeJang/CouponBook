import firebase from 'firebase';
import store from '../store';
import { login, logout } from '@modules/authentication';
import { firebaseConfig } from './configs';
import { TabHeading } from 'native-base';

class Firebase {
  constructor() {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

  auth = () => {
    return firebase.auth();
  };
  getUser = () => {
    return firebase.auth().currentUser;
  };

  getImageStorageRef = () => {
    return firebase.storage().ref('public/images/');
  };

  getDatabaseRef = () => {
    return firebase.database().ref();
  };
  getCouponsRef = () => {
    return firebase.database().ref('coupon/');
  };
  getCouponListRef = () => {
    return firebase.database().ref('couponList/');
  };
  getCUsersRef = () => {
    const uid = this.getUser().uid;
    return firebase.database().ref(`users/${uid}`);
  };
  getUsersRef = () => {
    return firebase.database().ref('users');
  };
  getDistributedRef = () => {
    return firebase.database().ref('distributed');
  };
}
/* // Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    //store.dispatch(login(user));
  } else {
    //store.dispatch(logout());
  }
}); */

export default new Firebase();

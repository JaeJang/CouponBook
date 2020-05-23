import firebase from '../configs/firebase';
import _ from 'lodash';
import store from '../store';
import { updateDist } from '../store/modules/from';
import { ALERT_TYPE, COUPON_STATUS, LIST_STATUS } from '../constants';
import * as Utils from '../utils/utils';

export const getList = type => {
  return new Promise((resolve, reject) => {
    const uid = firebase.getUser().uid;
    firebase
      .getUsersRef()
      .child(uid)
      .child(type)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          const values = Object.values(snapshot.val()).reverse();
          resolve(values);
        }
        resolve([]);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};

export const childAddedListener = (type, cb) => {
  //return new Promise((resolve, reject) => {
  const uid = firebase.getUser().uid;
  firebase.getUsersRef().child(uid).child(type).endAt().limitToLast(1).on('child_added', snapshot => {
    cb(snapshot.val());
  });
  //});
};

export const getUserByUid = uid => {
  return new Promise((resolve, reject) => {
    firebase
      .getUsersRef()
      .child(uid)
      .once('value')
      .then(snapshot => {
        resolve(snapshot.val());
      })
      .catch(error => {
        console.error(error);
        reject(error);
      });
  });
};

export const getDistributed = key => {
  return new Promise((resolve, reject) => {
    firebase
      .getDistributedRef()
      .child(key)
      .once('value')
      .then(snapshot => {
        resolve(snapshot.val());
      })
      .catch(error => {
        console.error(error);
        reject(error);
      });
  });
};

export const onDistributedChange = (key, cb) => {
  firebase.getDistributedRef().child(key).on('value', snapshot => {
    cb(snapshot.val());
  });

};
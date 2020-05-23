import firebase from '../configs/firebase';
import _ from 'lodash';
import store from '../store';
import { updateDist } from '../store/modules/from';
import { ALERT_TYPE, COUPON_STATUS, LIST_STATUS } from '../constants';
import * as Utils from '../utils/utils';

const listeners = [];

export const getFromListPagination = async key => {
  const uid = firebase.getUser().uid;
  try {
    const ref = firebase.getUsersRef().child(uid).child('from');
    const keys = key
      ? (await ref.orderByKey().endAt().limitToLast(10).once('value')).val()
      : (await ref.orderByKey().endAt().limitToLast(10).startAt(key).once('value')).val();
    const list = Object.values(keys);
    return list;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const requestCoupon = (key, index, ownerKey, title) => {
  const name = firebase.getUser().displayName;
  const uid = firebase.getUser().uid;
  return new Promise((resolve, reject) => {
    const alertKey = firebase.getUsersRef().child(`${ownerKey}/alert/to`).push().key;
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    firebase
      .getUsersRef()
      .child(`${ownerKey}/alert/to/${alertKey}`)
      .update({ title, name, key, index, type: ALERT_TYPE.REQUESTED, date: date.getTime(), userKey: uid })
      .then(() => {
        firebase
          .getDistributedRef()
          .child(`${key}/list/${index}`)
          .update({ status: COUPON_STATUS.REQUESTED })
          .then(() => {
            resolve()
          })
          .catch(error => {
            console.error(error);
            reject(error);
          });
      });
  });
};

export const deleteFrom = (key, userKey, title) => {
  const name = firebase.getUser().displayName;
  return new Promise((resolve, reject) => {
    firebase
      .getCUsersRef()
      .child('from')
      .child(key)
      .remove()
      .then(() => {
        //firebase.getUsersRef().child(userKey).child('to').child(key).remove();
        firebase.getDistributedRef().child(key).update({ status: LIST_STATUS.DELETED });
        const toAlertRef = firebase.getUsersRef().child(userKey).child('alert').child('to');
        const toAlertKey = toAlertRef.push().key;
        toAlertRef.child(toAlertKey).update({ date: Utils.getCurrentTime(), name, title, type: ALERT_TYPE.DELETED });
        resolve();
      })
      .catch(error => {
        console.error(error);
        reject();
      });
  });
};

export const removeListeners = () => {};

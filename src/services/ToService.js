import firebase from '../configs/firebase';
import _ from 'lodash';
import store from '../store';

import { COUPON_STATUS, ALERT_TYPE } from '@constants';

export const confirmCoupon = (title, key, index, userKey, alertKey) => {
  const name = firebase.getUser().displayName;
  const uid = firebase.getUser().uid;
  const date = new Date();
  date.setMilliseconds(0);
  date.setSeconds(0);
  return new Promise((resolve, reject) => {
    firebase
      .getDistributedRef()
      .child(key)
      .child(`list/${index}`)
      .update({ status: COUPON_STATUS.USED })
      .then(() => {
        const ref = firebase.getUsersRef().child(userKey).child('alert/from');
        const newAlertKey = ref.push().key;
        ref.child(newAlertKey)
          .update({ title, name, key, index, type: ALERT_TYPE.CONFIRMED, date: date.getTime(), userKey: uid });
        
        if (alertKey) {
          firebase.getCUsersRef().child('alert/to').child(alertKey).remove();
        }
        resolve();
      })
      .catch(error => {
        console.error(error);
        reject();
      });
  });
};

export const getToList = () => {
  return new Promise((resolve, reject) => {
    const uid = firebase.getUser().uid;
    firebase
      .getUsersRef()
      .child(uid)
      .child('to')
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

export const deleteTo = key => {
  return new Promise((resolve, reject) => {
    firebase.getCUsersRef().child('to').child(key).remove()
      .then(() => {
        firebase.getDistributedRef().child(key).remove();
        resolve();
      })
      .catch(error => {
        console.error(error);
        reject(error);
      })
  })
}

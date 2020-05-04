import firebase from '../configs/firebase';
import _ from 'lodash';
import store from '../store';
import { updateDist } from '@modules/from';
import { ALERT_TYPE, COUPON_STATUS } from '@constants';

export const getFromList = () => {
  return new Promise((resolve, reject) => {
    const uid = firebase.getUser().uid;
    firebase
      .getUsersRef()
      .child(uid)
      .child('from')
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          const values = Object.values(snapshot.val());
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

export const onDistributedChange = key => {
  firebase.getDistributedRef().child(key).on('value', snapshot => {
    store.dispatch(updateDist(key, snapshot.val()));
  });
};

export const requestCoupon = (key, index, ownerKey, title) => {
  const name = firebase.getUser().displayName;
  return new Promise((resolve, reject) => {
    const alertKey = firebase.getUsersRef().child(`${ownerKey}/alert/to`).push().key;
    firebase
      .getUsersRef()
      .child(`${ownerKey}/alert/to/${alertKey}`)
      .update({ title, name, key, type: ALERT_TYPE.REQUESTED })
      .then(() => {
        firebase.getDistributedRef().child(`${key}/list/${index}`).update({ status: COUPON_STATUS.REQUESTED })
        .then(() => resolve())
        .catch(error => {
          console.error(error);
          reject(error);
        })
      });
  });
};

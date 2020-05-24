import { Alert } from 'react-native';

import firebase from '../configs/firebase';
import NewCoupon from '../models/NewCoupon';
import store from '../store';

import { uploadToFirebase, uriToBlob } from '@utils/uploadImage';
import { COUPON_STATUS, LIST_STATUS, EXPIRE } from '@constants';
import * as Utils from '@utils/utils';

export const uploadPhoto = uri => {
  const uid = firebase.getUser().uid;
  return new Promise((resolve, reject) => {
    uriToBlob(uri)
      .then(blob => {
        const date = new Date();
        uploadToFirebase(blob, `${uid}_${date.getTime()}_coupon`)
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const createNewCoupon = data => {
  const uid = firebase.getUser().uid;
  return new Promise((resolve, reject) => {
    const newKeyCoupon = firebase.getCouponsRef().push().key;
    firebase
      .getCouponsRef()
      .child(`${newKeyCoupon}`)
      .update(data.getRequestData())
      .then(result => {
        firebase
          .getCUsersRef()
          .child(`myCoupons`)
          .child(newKeyCoupon)
          .set(newKeyCoupon)
          .then(result => {
            data.setKey(newKeyCoupon);
            data.setJustCreated(true);
            //data.setNumOfCoupons(1);
            resolve(data.getData());
          })
          .catch(error => {
            console.log(error);
            reject(error);
          });
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};

export const removeNewEntry = async item => {
  return new Promise((resolve, reject) => {
    const { key, image, justCreated, imageName } = item;
    const storageRef = firebase.getImageStorageRef();
    const dbCouponsRef = firebase.getCouponsRef();
    const dbCUserRef = firebase.getCUsersRef();
    const user = firebase.getUser();
    if (justCreated) {
      dbCouponsRef
        .child(key)
        .remove()
        .then(() => {
          dbCUserRef
            .child('myCoupons')
            .child(key)
            .remove()
            .then(() => {
              if (image !== user.photoURL && imageName) {
                storageRef
                  .child(imageName)
                  .delete()
                  .then(() => {
                    resolve();
                  })
                  .catch(error => console.log(error));
              }
            })
            .catch(async error => {
              const temp = new NewCoupon().setWithData(item);
              delete temp.getData().key;
              delete temp.getData().justCreated;
              await dbCouponsRef.child(key).set(temp.getData());
              reject();
            });
        })
        .catch(() => {
          reject();
        });
    } else {
    }
  });
};

export const createNewCouponList = data => {
  return new Promise((resolve, reject) => {
    const dbListRef = firebase.getCouponListRef();
    const newListKey = dbListRef.push().key;
    dbListRef
      .child(newListKey)
      .update(data)
      .then(() => {
        firebase
          .getCUsersRef()
          .child(`myCouponLists/${newListKey}`)
          .set(newListKey)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const removeListFromList = key => {
  return new Promise((resolve, reject) => {
    firebase.getCUsersRef().child(`myCouponLists/${key}`).remove().then(() => resolve()).catch(error => reject(error));
  });
};

export const getCoupon = key => {
  return new Promise((resolve, reject) => {
    firebase
      .getCouponsRef()
      .child(key)
      .once('value')
      .then(snapshot => {
        resolve(snapshot.val())}
      )
      .catch(error => reject(error));
  });
};

export const getMyCouponKeys = () => {
  return new Promise((resolve, reject) => {
    firebase
      .getCUsersRef()
      .child('myCoupons')
      .orderByKey()
      .once('value')
      .then(snapshot => resolve(Object.keys(snapshot.val()).reverse()))
      .catch(error => reject(error));
  });
};

export const getCouponByKey = key => {
  return new Promise((resolve, reject) => {
    firebase
      .getCouponsRef()
      .child(key)
      .once('value')
      .then(snapshot => resolve(snapshot.val()))
      .catch(error => reject(error));
  });
};

export const deleteCouponFromCouponList = (index, parentKey) => {
  return new Promise((resolve, reject) => {
    firebase
      .getCouponListRef()
      .child(`${parentKey}/list/${index}`)
      .remove()
      .then(() => resolve())
      .catch(error => reject(error));
  });
};

export const deleteCoupon = key => {
  return new Promise((resolve, reject) => {
    firebase.getCUsersRef()
      .child('myCoupons')
      .child(key)
      .remove()
      .then(() => resolve())
      .catch(error => reject(error));
  });
};

export const checkUser = email => {
  return new Promise((resolve, reject) => {
    firebase
      .getUsersRef()
      .orderByChild('email')
      .equalTo(email)
      .once('value')
      .then(snapshot => {
        const value = snapshot.val();
        if (value) resolve(value);
        resolve(false);
      })
      .catch(error => {
        console.error(error);
        reject(error);
      });
  });
};

export const getCurrentUserEmail = () => {
  return firebase.getUser().email;
};

export const sendList = async (email, item, userKey) => {
  const object = {};
  object.title = item.title;
  object.status = LIST_STATUS.PENDING;
  object.image = item.image;
  object.list = [];
  object.numOfCoupons = 0;
  const couponsInStore = store.getState().mycoupons.coupons;
  for (let coupon of item.list) {
    object.numOfCoupons += coupon.numOfCoupons;
    let couponToBeAdded;
    for (let couponInStore of couponsInStore) {
      if (couponInStore.key === coupon.key) {
        couponToBeAdded = couponInStore;
      }
    }
    if (!couponToBeAdded) {
      couponToBeAdded = await getCoupon(coupon.key);
    }
    if (couponToBeAdded.expireOption === EXPIRE.IN) {
      couponToBeAdded.expireOption = EXPIRE.AT;
      couponToBeAdded.expireAt = Utils.convertExpiry(couponToBeAdded.expireIn);
    } else if (couponToBeAdded.expireOption === EXPIRE.AT && Utils.checkExpiry(couponToBeAdded.expireAt)) {
      continue;
    }
    for (let i = 0; i < coupon.numOfCoupons; ++i) {
      object.list.push({ ...couponToBeAdded, status: COUPON_STATUS.NOT_USED });
    }
  }

  return new Promise((resolve, reject) => {
    const ref = firebase.getDistributedRef();
    const newDistributedKey = ref.push().key;
    object.key = newDistributedKey;
    ref
      .child(newDistributedKey)
      .update(object)
      .then(() => {
        object.userKey = userKey;
        firebase
          .getCUsersRef()
          .child(`to/${newDistributedKey}`)
          .set({ key: newDistributedKey, userKey: userKey })
          .then(() => {
            firebase
              .getUsersRef()
              .child(userKey)
              .child(`from/${newDistributedKey}`)
              .set({ key: newDistributedKey, userKey: firebase.getUser().uid })
              .then(() => resolve())
              .catch(error => {
                console.error(error);
                ref.child(newDistributedKey).remove();
                firebase.getCUsersRef().child(`to/${newDistributedKey}`).remove();
                reject(error);
              });
          })
          .catch(error => {
            ref.child(newDistributedKey).remove();
            console.log(error);
            reject(error);
          });
      })
      .catch(error => {
        ref.child(newDistributedKey).remove();
        console.error(error);
        reject(error);
      });
  });
};

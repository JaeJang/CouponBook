import firebase from '../configs/firebase';

import NewCoupon from '../models/NewCoupon';

import { uploadToFirebase, uriToBlob } from '@utils/uploadImage';

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
          .child(`mycoupons`)
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
    firebase.getCouponsRef().child(key).once('value')
      .then(snapshot => resolve(snapshot.val()))
      .catch(error => reject(error));
  });
}

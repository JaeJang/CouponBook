import AsyncStorage from '@react-native-community/async-storage';
import SInfo from 'react-native-sensitive-info';
import CryptoJS from "react-native-crypto-js";

import firebase from '../configs/firebase';
import { uploadToFirebase, uriToBlob } from '@utils/uploadImage';
import { Alert } from 'react-native';
import Toast from 'react-native-simple-toast';
import store from '../store';
import { processing, processed } from '@store/modules/processing';


export const updatePhotoUrl = (uri, onSuccess) => {
  const user = firebase.getUser();
  store.dispatch(processing());
  uriToBlob(uri)
    .then(blob => {
      uploadToFirebase(blob, `${user.uid}_default`)
        .then(data => {
          user
            .updateProfile({
              photoURL: data.url
            })
            .then(() => {
              store.dispatch(processed());
              onSuccess(user.photoURL);
              Toast.showWithGravity('Image uploaded', Toast.SHORT, Toast.BOTTOM);
            })
            .catch(error => {
              store.dispatch(processed());
              Alert.alert('Upload Image', 'Something went wrong! Please try again.');
              console.error(error);
            });
        })
        .catch(error => {
          store.dispatch(processed());
          Alert.alert('Upload Image', 'Something went wrong! Please try again.');
          console.error(error);
        });
    })
    .catch(error => {
      store.dispatch(processed());
      Alert.alert('Upload Image', 'Something went wrong! Please try again.');
      console.error(error);
    });
};

export const getToAlerts = async cb => {
  firebase.getCUsersRef().child('alert/to').on('value', snapshot => {
    if (snapshot.val()) {
      cb(snapshot.val());
    }
  });
};

export const getFromAlerts = async cb => {
  firebase.getCUsersRef().child('alert/from').on('value', snapshot => {
    if (snapshot.val()) {
      cb(snapshot.val());
    }
  });
};

export const logout = () => {
  firebase.auth().signOut();
  store.dispatch({ type: 'LOGOUT' });
};

export const deleteToAlert = key => {
  firebase.getCUsersRef().child('alert/to').child(key).remove();
};

export const deleteFromAlert = key => {
  firebase.getCUsersRef().child('alert/from').child(key).remove();
};

export const getRememberMe = async () => {
  const rememberMe = await AsyncStorage.getItem('rememberMe');
  if (rememberMe === 'true') {
    return await getCredentials();
  }
};

export const setRememberme = async value => {
  await AsyncStorage.setItem('rememberMe', value.toString());
};

export const getCredentials = async () => {
  try {
    const snapshot = await firebase.getEncryptSaltRef().once('value');
    const salt = snapshot.val();
    const em = await SInfo.getItem('em',{});
    const pw = await SInfo.getItem('pw',{});
    const decryptedEmail = CryptoJS.AES.decrypt(em, salt).toString(CryptoJS.enc.Utf8);
    const decryptedPw = CryptoJS.AES.decrypt(pw, salt).toString(CryptoJS.enc.Utf8);
    return { email: decryptedEmail, password: decryptedPw };
  } catch (error) {
    return false;
  }
};

export const setCredentials = async (email, password) => {
  const snapshot = await firebase.getEncryptSaltRef().once('value');
  const salt = snapshot.val();
  if (!salt) return;
  const encryptedEmail = CryptoJS.AES.encrypt(email, salt).toString();
  const encryptedPw = CryptoJS.AES.encrypt(password, salt).toString();
  SInfo.setItem('em', encryptedEmail, {});
  SInfo.setItem('pw', encryptedPw, {});
}

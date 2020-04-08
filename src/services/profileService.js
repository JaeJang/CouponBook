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
    })
};

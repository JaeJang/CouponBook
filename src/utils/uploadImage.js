import firebase from '../configs/firebase';

export const uriToBlob = uri => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
      // return the blob
      resolve(xhr.response);
    };

    xhr.onerror = function() {
      // something went wrong
      reject(new Error('uriToBlob failed'));
    };

    // this helps us get a blob
    xhr.responseType = 'blob';

    xhr.open('GET', uri, true);
    xhr.send(null);
  });
};

export const uploadToFirebase = (blob, name) => {
  return new Promise((resolve, reject) => {
    const storageRef = firebase.getImageStorageRef();
    name = `${name}_${new Date().getTime()}.jpg`;
    storageRef
      .child(`${name}`)
      .put(blob, {
        contentType: 'image/jpeg'
      })
      .then(snapshot => {
        blob.close();
        return storageRef.child(`${name}`).getDownloadURL();
      })
      .then(url => {
        resolve({url:url, name:name});
      })
      .catch(error => {
        reject(error);
      });
  });
};

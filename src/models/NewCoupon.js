import firebase from '../configs/firebase';
import _ from 'lodash';

class NewCoupon {
  constructor(data) {
    this.data = {
      ...data,
      createdAt: new Date().toDateString(),
      createdBy: firebase.getUser().uid,
      numOfCoupons: 1
    };
    delete this.data.image;
  }

  getData = () => {
    return this.data;
  };

  setImage = imageData => {
    this.data.image = imageData.url;
    this.data.imageName = imageData.name;
  };

  setKey = key => {
    this.data.key = key;
  };
  getKey = () => {
    return this.data.key;
  };
  setJustCreated = justCreated => {
    this.data.justCreated = justCreated;
  };
  getJustCreated = () => {
    return this.data.justCreated;
  };
  setWithData = data => {
    this.data = data;
  };
  setNumOfCoupons = number => {
    this.data.numOfCoupons = number;
  }
  getRequestData = () => {
    return {
      image: _.get(this.data, 'image', ''),
      expireOption: _.get(this.data, 'expireOption', ''),
      description: _.get(this.data, 'description', ''),
      note: _.get(this.data, 'note', ''),
      expireIn: _.get(this.data, 'expireIn', {}),
      expireAt: _.get(this.data, 'expireAt', ''),
      title: _.get(this.data, 'title', ''),
      createdAt: _.get(this.data, 'createdAt', ''),
      createdBy: _.get(this.data, 'createdBy', '')
    };
  };
}

export default NewCoupon;

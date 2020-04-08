import _ from 'lodash';

class NewCouponList {
  constructor(list, name) {
    this.data = {
      list: this.createNewCouponList(list),
      image: _.get(list,'[0].image', ''),
      createdAt: (new Date()).getTime(),
      title: name,
      numOfCoupons: list.length,
      key: ''
    }
//장재혁 똥멍청이 캬캬캬캬
  }

  setKey = key => {
    this.data.key = key;
  }
  
  getRequestData = () => {
    return this.data;
  }

  createNewCouponList = list => {
    const newList = [];
    for (let coupon of list) {
      newList.push({key: coupon.key, numOfCoupons: coupon.numOfCoupons});
    }
  
    return newList;
  
  }
}

export default NewCouponList;
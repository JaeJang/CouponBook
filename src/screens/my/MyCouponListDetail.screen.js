import React, { Component } from 'react';
import { Alert, View, FlatList } from 'react-native';

import Card from '@components/Card';

import { CARD_TYPE } from '@constants';
import * as MyCouponService from '@service/MyCouponService';

class MyCouponListDetail extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: navigation.getParam('title')
    };
  };

  constructor() {
    super();
    this.state = {
      scroll: true,
      list: []
    };
  }

  async componentDidMount() {
    const list = this.props.navigation.getParam('list', []);
    for (let element of list) {
      let coupon;
      try {
        coupon = await MyCouponService.getCoupon(element.key);
      } catch (error) {
        Alert.alert('My Coupon List', 'Something went wrong. Please try again.');
        this.props.navigation.goBack();
      }
      coupon.numOfCoupons = element.numOfCoupons;
      this.setState({ list: this.state.list.concat(coupon) });
    }
  }

  onPressCard = () => {
    this.props.navigation.setParams({ headerShown: false });
    this.setState({ scroll: false });
  };

  onPressCardBack = () => {
    this.props.navigation.setParams({ headerShown: true });
    this.setState({ scroll: true });
  };

  render() {
    const { list } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          scrollEnabled={this.state.scroll}
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          data={list}
          renderItem={(item, index) =>
            <Card
              type={CARD_TYPE.COUPON}
              item={item.item}
              onPress={this.onPressCard}
              onPressBack={this.onPressCardBack}
            />}
        />
      </View>
    );
  }
}

export default MyCouponListDetail;

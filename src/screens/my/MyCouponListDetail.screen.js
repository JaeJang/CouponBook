import React, { Component } from 'react';
import { Alert, View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Card from '@components/Card';

import { CARD_TYPE } from '@constants';
import * as MyCouponService from '@service/MyCouponService';
import store from '../../store';
import { processing, processed } from '@store/modules/processing';
import { removeCouponFromList } from '@modules/mycoupons';

class MyCouponListDetail extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: navigation.getParam('title', ''),
      headerShown: navigation.getParam('headerShown', true)
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      scroll: true,
      list: [],
      parentKey: props.navigation.getParam('parentKey', '')
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
      coupon.key = element.key;
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

  onDelete = (item, index) => {
    const { parentKey } = this.state;
    Alert.alert('My Coupon List', `Do you really want to delete ${item.title} from the list`, [
      {
        text: 'Cancel'
      },
      {
        text: 'Delete',
        onPress: () => {
          store.dispatch(processing());
          MyCouponService.deleteCouponFromCouponList(index, parentKey)
            .then(() => {
              const { list } = this.state;
              list.splice(index, 1);
              this.setState({ list: list });
              this.props.removeCouponFromList(parentKey, item.key);
            })
            .catch(error => {
              console.error(error);
              Alert.alert('My Coupon List', 'Something went wrong. Please try again');
            })
            .finally(() => store.dispatch(processed()));
        }
      }
    ]);
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
          renderItem={({ item, index }) =>
            <Card
              type={CARD_TYPE.COUPON}
              item={item}
              onPress={this.onPressCard}
              onPressBack={this.onPressCardBack}
              showXButton={true}
              onPressX={() => this.onDelete(item, index)}
            />}
        />
      </View>
    );
  }
}

MyCouponListDetail.propTypes = {};

export default connect(null, { removeCouponFromList })(MyCouponListDetail);

import React, { Component } from 'react';
import { Alert, View, FlatList, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Fab, Icon } from 'native-base';

import Card from '../../components/Card';

import { CARD_TYPE } from '../../constants';
import * as MyCouponService from '../../services/MyCouponService';
import store from '../../store';
import { processing, processed } from '../../store/modules/processing';
import { removeCouponFromList } from '../../store/modules/mycoupons';

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
      parentKey: props.navigation.getParam('parentKey', ''),
      //fabOpac: new Animated.Value(1),
      fabOpac: 1,
      pressed: false
    };
  }

  async componentDidMount() {
    const list = this.props.navigation.getParam('list', []);
    const { couponsInStore } = this.props;
    const couponList = [];
    for (let element of list) {
      let coupon;
      for (let couponInStore of couponsInStore) {
        if (couponInStore.key === element.key) {
          coupon = couponInStore;
        }
      }
      if (!coupon) {
        try {
          coupon = await MyCouponService.getCoupon(element.key);
        } catch (error) {
          Alert.alert('My Coupon List', 'Something went wrong. Please try again.');
          this.props.navigation.goBack();
        }
      }
      coupon.numOfCoupons = element.numOfCoupons;
      coupon.key = element.key;
      couponList.push(coupon);
    }
    this.setState({ list: couponList });
  }

  onPressCard = () => {
    this.props.navigation.setParams({ headerShown: false });
    this.setState({ scroll: false, pressed: true, fabOpac: 0 });
    //Animated.spring(this.state.fabOpac, { toValue: 0 }).start();
    
  };

  onPressCardBack = () => {
    this.props.navigation.setParams({ headerShown: true });
    this.setState({ scroll: true, pressed: false, fabOpac: 1 });
    //Animated.spring(this.state.fabOpac, { toValue: 1 }).start();
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
    const { list, scroll, fabOpac, pressed } = this.state;
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
              pressed={pressed}
            />}
        />
        <Fab
          active={false}
          direction="up"
          containerStyle={{ opacity: fabOpac }}
          style={{ backgroundColor: '#00aaff' }}
          position="bottomRight"
          onPress={scroll ? this.props.navigation.goBack : null}
        >
          <Icon type="Ionicons" name="ios-arrow-back" />
        </Fab>
      </View>
    );
  }
}

MyCouponListDetail.propTypes = {};

const mapStateToProps = state => {
  return {
    couponsInStore: state.mycoupons.coupons
  };
};

export default connect(mapStateToProps, { removeCouponFromList })(MyCouponListDetail);

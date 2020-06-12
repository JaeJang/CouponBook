import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Fab } from 'native-base';

import Card from '@components/Card';
import CollapsibleHeader from '@components/CollapsibleHeader';
import Button from '@components/SubmitButton';

import * as MyCouponService from '@service/MyCouponService';
import { CARD_TYPE } from '@constants';
import { getMyCoupons, getMyCouponsKeyAfter, removeCoupon } from '@modules/mycoupons';
import EmptyMessage from '../../components/EmptyMessage';

class MyCouponScreen extends Component {
  /*   static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerShown: navigation.getParam('headerShown', true)
    };
  }; */

  constructor() {
    super();
    this.state = {
      scroll: true,
      list: [],
      pressed: false
    };
  }

  componentDidMount() {
    if (!this.props.coupons.length) {
      this.props.getMyCoupons();
    }
  }

  onPressCard = () => {
    this.props.navigation.setParams({ headerShown: false });
    this.setState({ scroll: false, pressed: true });
  };

  onPressCardBack = () => {
    this.props.navigation.setParams({ headerShown: true });
    this.setState({ scroll: true, pressed: false });
  };

  onPressDelete = (item, index) => {
    Alert.alert(
      'My Coupons',
      `Do you really want to delete ${item.title}? The coupon in the lists will be still there`,
      [
        {
          text: 'Cancel'
        },
        {
          text: 'Ok',
          onPress: () => {
            MyCouponService.deleteCoupon(item.key)
              .then(() => {
                this.props.removeCoupon(item.key, index);
              })
              .catch(error => {
                console.error(error);
                Alert.alert('My coupons', 'Something went wrong! Please try again.');
              });
          }
        }
      ]
    );
  };

  goToAddCoupon = () => {
    this.props.navigation.navigate('New Coupon', { status: 'COUPON' });
  };

  renderFooter = () => {
    const { couponKeys, couponLastKey } = this.props;
    const index = couponKeys.indexOf(couponLastKey);
    if (index + 1 < couponKeys.length) {
      return (
        <View style={{ flex: 1 }}>
          <Button label="Load More" onPress={this.props.getMyCouponsKeyAfter} />
        </View>
      );
    }
    return null;
  };

  render() {
    const { pressed, scroll } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <CollapsibleHeader
          route={this.props.navigation.state.routeName}
          navigation={this.props.navigation}
          list={this.props.coupons}
          scrollEnabled={!this.props.coupons.length ? false : scroll}
          ListFooterComponent={this.renderFooter}
          renderItem={({ item, index }) =>
            <Card
              type={CARD_TYPE.COUPON}
              item={item}
              onPress={() => this.onPressCard(item)}
              onPressBack={this.onPressCardBack}
              onPressX={() => this.onPressDelete(item, index)}
              showXButton={true}
              disableButton={true}
              pressed={pressed}
            />}
        />
        {this.props.coupons &&
          !this.props.coupons.length &&
          <EmptyMessage message="You don't have any coupons yet!" containerStyle={{ justifyContent: 'flex-start' }} />}
        <Fab
          active={false}
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: '#00afff' }}
          position="bottomRight"
          onPress={this.goToAddCoupon}
        >
          <Icon name="md-add" />
        </Fab>
      </View>
    );
  }
}

MyCouponScreen.propTypes = {
  coupons: PropTypes.array.isRequired,
  couponKeys: PropTypes.array.isRequired,
  couponLastKey: PropTypes.string.isRequired,
  getMyCoupons: PropTypes.func.isRequired,
  getMyCouponsKeyAfter: PropTypes.func.isRequired,
  removeCoupon: PropTypes.func.isRequired
};

const mapStateToProp = state => {
  return {
    coupons: state.mycoupons.coupons,
    couponKeys: state.mycoupons.couponKeys,
    couponLastKey: state.mycoupons.couponLastKey
  };
};

export default connect(mapStateToProp, { getMyCoupons, getMyCouponsKeyAfter, removeCoupon })(MyCouponScreen);

import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Button from '@components/SubmitButton';
import Card from '@components/Card';

import { CARD_TYPE } from '@constants';
import { getMyCoupons, getMyCouponsKeyAfter } from '@modules/mycoupons';

class ImportCouponScreen extends Component {
  componentDidMount() {
    if (!this.props.coupons.length) {
      this.props.getMyCoupons();
    }
  }

  onPress = index => {
    const { coupons } = this.props;
    const list = coupons[index];
    list.numOfCoupons = 1;
    this.props.navigation.navigate('Add Coupon List', { newCoupon: list });
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
    const { coupons } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={coupons}
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          keyExtractor={item => item.key}
          ListFooterComponent={this.renderFooter}
          renderItem={({ item, index }) =>
            <Card type={CARD_TYPE.IMPORT} item={item} onPress={() => this.onPress(index)} />}
        />
      </View>
    );
  }
}

ImportCouponScreen.propTypes = {
  coupons: PropTypes.array.isRequired,
  couponKeys: PropTypes.array.isRequired,
  couponLastKey: PropTypes.string.isRequired,
  getMyCoupons: PropTypes.func.isRequired,
  getMyCouponsKeyAfter: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    coupons: state.mycoupons.coupons,
    couponKeys: state.mycoupons.couponKeys,
    couponLastKey: state.mycoupons.couponLastKey
  };
};

export default connect(mapStateToProps, { getMyCoupons, getMyCouponsKeyAfter })(ImportCouponScreen);

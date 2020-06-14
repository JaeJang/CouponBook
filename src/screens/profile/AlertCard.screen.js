import React, { Component } from 'react';
import { View, Alert } from 'react-native';

import { CARD_TYPE, ALERT_TYPE, COUPON_STATUS } from '../../constants';
import { processing, processed } from '../../store/modules/processing';
import store from '../../store';
import * as ToService from '../../services/ToService';

import Card from '@components/Card';

class AlertCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: props.navigation.getParam('dist', null)
    };
  }

  onPressConfirm = () => {
    const { key, index, userKey, title, alertKey } = this.state.item;

    store.dispatch(processing());
    ToService.confirmCoupon(title, key, index, userKey, alertKey)
      .then(() => {
        this.setState({ item: { ...this.state.item, status: COUPON_STATUS.USED } });
      })
      .catch(() => {
        Alert.alert('Profile', 'Failed to confirm. Please try again');
      })
      .finally(() => store.dispatch(processed()));
  };

  render() {
    const { item } = this.state;
    const type = item.type === ALERT_TYPE.REQUESTED ? CARD_TYPE.COUPON_TO : CARD_TYPE.COUPON;
    return (
      <View>
        <Card
          type={type}
          item={this.state.item}
          isAlert={true}
          onPress={() => this.props.navigation.goBack()}
          onPressBack={() => this.props.navigation.goBack()}
          onPressMainButton={this.onPressConfirm}
        />
      </View>
    );
  }
}

export default AlertCard;

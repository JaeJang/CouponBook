import React, { Component } from 'react';
import { FlatList, View, Alert } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Card from '../../components/Card';
import * as ToService from '../../services/ToService';
import { CARD_TYPE } from '../../constants';
import FromToDetail from '../../components/FromToDetail';
import store from '../../store';
import { processing, processed } from '../../store/modules/processing';
import { NavigationActions } from 'react-navigation';

class ToDetailScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: navigation.getParam('title', ''),
      //header: navigation.getParam("headerShown", true)
      headerShown: false
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      index: props.navigation.getParam('index'),
      pressed: false
    };
  }

  onPressMainButton = (item, index) => {
    const userKey = this.props.toKeys[this.state.index].userKey;
    const key = this.props.toKeys[this.state.index].key;
    store.dispatch(processing());
    ToService.confirmCoupon(item.title, key, index, userKey)
      .then(() => {})
      .catch(error => {
        Alert.alert('Coupons', 'Something went wrong. Please try again');
      })
      .finally(() => {
        store.dispatch(processed());
      });
  };

  render() {
    const item = this.props.toList[this.state.index];
    return (
      <FromToDetail
        coupons={item}
        type={CARD_TYPE.COUPON_TO}
        onPressMainButton={this.onPressMainButton}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => ({
  toList: state.to.toList,
  toKeys: state.to.toKeys
});

export default connect(mapStateToProps, null)(ToDetailScreen);

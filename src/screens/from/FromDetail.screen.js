import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Card from '../../components/Card';
import * as FromService from '../../services/FromService';
import { CARD_TYPE } from '../../constants';
import FromToDetail from '../../components/FromToDetail';
import { Fab, Icon } from 'native-base';

class FromDetailScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerShown: false
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      index: props.navigation.getParam('index')
    };
  }

  onPressMainButton = (item, index) => {
    const key = this.props.fromList[this.state.index].key;
    FromService.requestCoupon(key, index, item.createdBy, item.title).catch(error =>
      Alert.alert('From', 'Something went wrong. Please try again later')
    );
  };

  onPressX = (item, index, couponTitle) => {
    Alert.alert(item.title, `Do you really want to delete ${couponTitle} from ${item.title}? `, [
      {
        text: 'Cancel'
      },
      {
        text: 'Ok',
        onPress: () => {
          FromService.deleteCoupon(item.key, item.userKey, index, item.title, couponTitle)
            .then(() => {
              //this.props.removeCoupon(item.key, index);
            })
            .catch(error => {
              console.error(error);
              Alert.alert('My coupons', 'Something went wrong! Please try again.');
            });
        }
      }
    ]);
  };

  render() {
    const item = this.props.fromList[this.state.index];
    return (
      <FromToDetail
        coupons={item}
        type={CARD_TYPE.COUPON}
        onPressMainButton={this.onPressMainButton}
        onPressX={this.onPressX}
        showXButton={true}
        {...this.props}
      />
    );
  }
}

FromDetailScreen.propTypes = {};

const mapStateToProps = state => ({
  fromList: state.from.fromList,
  fromKeys: state.from.fromKeys
});

export default connect(mapStateToProps, null)(FromDetailScreen);

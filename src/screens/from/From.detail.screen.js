import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';

import Card from '@components/Card';
import * as FromService from '@service/FromService';
import { CARD_TYPE } from '@constants';

class FromDetailScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: navigation.getParam('title', ''),
      //header: navigation.getParam('headerShown', true)
      headerShown: false
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      scroll: true,
      item: props.navigation.getParam('item', null)
    };
  }

  onPressCard = () => {
    this.props.navigation.setParams({ headerShown: null });
    this.setState({ scroll: false });
  };

  onPressCardBack = () => {
    this.props.navigation.setParams({ headerShown: true });
    this.setState({ scroll: true });
  };

  onPressRequest = (item, index) => {
    const key = this.state.item.key;
    FromService.requestCoupon(key, index, item.createdBy, item.title)
      .catch(error => Alert.alert('From', 'Something went wrong. Please try again later'));
  }

  render() {
    const { item, scroll } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <FlatList 
          scrollEnabled={scroll}
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          data={item.list}
          renderItem={({ item, index}) => (
            <Card
              type={CARD_TYPE.COUPON}
              onPress={this.onPressCard}
              onPressBack={this.onPressCardBack}
              onPressRequest={() => this.onPressRequest(item, index)}
              item={item}
            />
          )}
        />
      </View>
    );
  }
}

FromDetailScreen.propTypes = {};

export default FromDetailScreen;

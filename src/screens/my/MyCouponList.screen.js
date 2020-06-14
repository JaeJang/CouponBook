import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Fab } from 'native-base';

import CollapsibleHeader from '@components/CollapsibleHeader';
import Card from '@components/Card';

import { CARD_TYPE } from '@constants';
import { getMyCouponLists, addCouponList, removeListFromList } from '@modules/mycoupons';
import * as MyCouponService from '@service/MyCouponService';
import store from '../../store';
import { processing, processed } from '@store/modules/processing';
import EmptyMessage from '../../components/EmptyMessage';

const H_MAX_HEIGHT = 150;
const H_MIN_HEIGHT = 52;
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

class MyCouponListScreen extends Component {
  componentDidMount() {
    if (!this.props.lists.length) {
      this.props.getMyCouponLists();
    }
  }

  componentWillUpdate(prevProps) {}
  goToAddList = () => {
    this.props.navigation.navigate('Add Coupon List');
  };

  onPressX = (item, index) => {
    Alert.alert('My Coupon List', `Do you really want to delete ${item.title} from your list?`, [
      {
        text: 'Cancel'
      },
      {
        text: 'Ok',
        onPress: () => {
          store.dispatch(processing());
          MyCouponService.removeListFromList(item.key)
            .then(() => this.props.removeListFromList(index))
            .catch(() => {
              console.log(error);
              Alert.alert('My Coupon List', 'Something went wrong. Please try again');
            })
            .finally(() => store.dispatch(processed()));
        }
      }
    ]);
  };

  onPressList = item => {
    this.props.navigation.navigate('My Coupon List Detail', {
      title: item.title,
      list: item.list,
      parentKey: item.key
    });
  };

  onPressShare = item => {
    this.props.navigation.navigate('Share', { item: item });
  };

  render() {
    const { lists } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <CollapsibleHeader
          route={this.props.navigation.state.routeName}
          navigation={this.props.navigation}
          list={lists}
          scrollEnabled={lists.length ? true : false}
          renderItem={({ item, index }) =>
            <Card
              type={CARD_TYPE.LIST}
              item={item}
              showXButton={true}
              onPress={() => this.onPressList(item)}
              onPressX={() => this.onPressX(item, index)}
              sharable={true}
            />}
        />
        {!lists.length &&
          <EmptyMessage 
            message="Make your own coupon list and share!"
            containerStyle={{justifyContent: 'flex-start'}}
          />}
        <Fab
          active={false}
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: '#00afff' }}
          position="bottomRight"
          onPress={this.goToAddList}
        >
          <Icon name="md-add" />
        </Fab>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    lists: state.mycoupons.lists
  };
};

export default connect(mapStateToProps, { getMyCouponLists, addCouponList, removeListFromList })(MyCouponListScreen);

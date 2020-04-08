import React, { Component } from 'react';
import { Text, View, FlatList, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Fab } from 'native-base';

import firebase from '../../configs/firebase';

import CollapsibleHeader from '@components/CollapsibleHeader';
import CouponCard from '@components/CouponCard';
import Card from '@components/Card';

import { CARD_TYPE } from '@constants';
import { getMyCouponLists, addCouponList, removeListFromList } from '@modules/mycoupons';
import * as MyCouponService from '@service/MyCouponService';
import store from '../../store';
import { processing, processed } from '@store/modules/processing';

const H_MAX_HEIGHT = 150;
const H_MIN_HEIGHT = 52;
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

class MyCouponListScreen extends Component {
  componentDidMount() {
    this.props.getMyCouponLists();
  }

  componentWillUpdate(prevProps) {
    if (prevProps.lists.length !== this.props.lists.length) {
      console.log(this.props.lists);
    }
  }
  goToAddList = () => {
    this.props.navigation.navigate('Add Coupon List');
  };

  onPressX = item => {

    Alert.alert('My Coupon List', `Do you really want to delete ${item.title} from the list?`, [
      {
        text: 'CANCEL'
      },
      {
        text: 'OK',
        onPress: () => {
          store.dispatch(processing());
          MyCouponService.removeListFromList(item.key)
            .then(() => this.props.removeListFromList(index))
            .catch(() => {console.log(error);Alert.alert('My Coupon List', 'Something went wrong. Please try again')})
            .finally(() => store.dispatch(processed()));
        }
      }
    ]);
  };

  onPressList = item => {
    this.props.navigation.navigate('My Coupon List Detail', {title: item.tilte, list: item.list});
  }

  render() {
    const { lists } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <CollapsibleHeader
          route={this.props.navigation.state.routeName}
          navigation={this.props.navigation}
          list={lists}
          renderItem={({ item, index }) =>
            <Card
              type={CARD_TYPE.LIST}
              item={item}
              showXButton={true}
              onPress={() => this.onPressList(item)}
              onPressX={() => this.onPressX(item)}
            />}
        >
          {/* <FlatList 
            data={lists}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.key}
            renderItem={({item, index}) => (
              <Card
                type={CARD_TYPE.LIST}
                item={item}
                showXButton={true}
              />
            )}
          /> */}
          {/* {lists.map((item, index) => (
            <Card
              type={CARD_TYPE.LIST}
              item={item}
              showXButton={true}
            />            
          ))} */}
        </CollapsibleHeader>
        <Fab
          active={false}
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: '#ff6d1a' }}
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

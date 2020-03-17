import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import { Icon, Fab } from 'native-base';

const actions = [
  {
    text: 'From',
    icon: <Icon active name="md-arrow-round-down" />,
    name: 'From',
    buttonSize: 50,
    textBackground: 'rgba(0,0,0,0)',
    textColor: '#fff',
    textStyle: {fontSize: 20},
    position: 1
  },
  {
    text: 'To',
    icon: <Icon active name="md-arrow-round-up" />,
    name: 'To',
    buttonSize: 50,
    textBackground: 'rgba(0,0,0,0)',
    textColor: '#fff',
    textStyle: {fontSize: 20},
    position: 2
  },
  {
    text: 'My Coupons',
    icon: <Icon active name="md-filing" />,
    name: 'MyCoupons',
    buttonSize: 50,
    textBackground: 'rgba(0,0,0,0)',
    textColor: '#fff',
    textStyle: {fontSize: 20},
    position: 3
  },
  {
    text: 'Add New Coupon List',
    icon: <Icon active name="md-add" />,
    name: 'New',
    buttonSize: 50,
    textBackground: 'rgba(0,0,0,0)',
    textColor: '#fff',
    textStyle: {fontSize: 20},
    position: 4
  }
];

class MyCouponScreen extends Component {

  goToAddList = () => {
    this.props.navigation.navigate('Add Coupon List');
  }

  render() {
    return (
      <View style={{flex:1}}>
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

export default MyCouponScreen;

import React, { Component } from 'react';
import { View } from 'react-native';

import CollapsibleHeader from '@components/CollapsibleHeader';
class MyCouponScreen extends Component {
  render() {
    return (
      <View style={{flex:1}}>
        <CollapsibleHeader route={this.props.navigation.state.routeName} navigation={this.props.navigation}>
          
        </CollapsibleHeader>
      </View>
    )
  }
}

export default MyCouponScreen;

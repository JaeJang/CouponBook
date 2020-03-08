import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import LoginScreen from '@screens/login.screen';
import FromScreen from '@screens/from/from.screen';
import ToScreen from '@screens/to/to.screen';
import MyCouponScreen from '@screens/my/MyCoupon.screen';

const LoginStackNavigator = createStackNavigator({
  LogIn: {
    screen: LoginScreen,
    navigationOptions: () => ({
      headerShown: false
    })
  }
});

const FromStackNavigator = createStackNavigator({
  From: {
    screen: FromScreen
  }
});

const ToStackNavigator = createStackNavigator({
  To: {
    screen: ToScreen
  }
});

const MyCouponsStackNavigator = createStackNavigator({
  'My Coupons': {
    screen: MyCouponScreen
  }
})

const CouponTabNavigator = createMaterialTopTabNavigator({
  From: {
    screen: FromStackNavigator,
    navigationOptions: {
      tabBarVisible: false
    }
  },
  To: {
    screen: ToStackNavigator,
    navigationOptions: {
      tabBarVisible: false
    }
  },
  MyCoupons: {
    screen: MyCouponsStackNavigator,
    navigationOptions: {
      tabBarVisible: false
    }
  }
});

const MainStackNavigator = createSwitchNavigator({
  Coupon: {
    screen: CouponTabNavigator
  }
});
/* const CouponStackNavigator = createStackNavigator({
  CouponTabNavigator: {
    screen: CouponTabNavigator
  }
}) */

const AppSwitchNavigator = createSwitchNavigator({
  Login: { screen: LoginStackNavigator },
  Main: { screen: MainStackNavigator }
});

export default createAppContainer(AppSwitchNavigator);

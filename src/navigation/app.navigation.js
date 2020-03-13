import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator, createBottomTabNavigator ,createTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

import LoginScreen from '@screens/login.screen';
import FromScreen from '@screens/from/from.screen';
import ToScreen from '@screens/to/to.screen';
import MyCouponScreen from '@screens/my/MyCoupon.screen';
import ProfileScreen from '@screens/profile/profile.screen';

import { Icon } from 'native-base';

const LoginStackNavigator = createStackNavigator({
  LogIn: {
    screen: LoginScreen,
    navigationOptions: () => ({
      headerShown: false
    })
  }
});

const FromStackNavigator = createStackNavigator(
  {
    From: {
      screen: FromScreen
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerShown: false
      };
    }
  }
);

const ToStackNavigator = createStackNavigator({
  To: {
    screen: ToScreen
  }
});

const MyCouponsStackNavigator = createStackNavigator({
  'My Coupons': {
    screen: MyCouponScreen
  }
});

const ProfileStackNavigator = createStackNavigator({
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      headerShown: false
    }
  }
})

const CouponTabNavigator = createBottomTabNavigator({
  From: {
    screen: FromStackNavigator,
    navigationOptions: {
      //tabBarVisible: false
    }
  },
  To: {
    screen: ToStackNavigator,
    navigationOptions: {
      //tabBarVisible: false
    }
  },
  'My Coupons': {
    screen: MyCouponsStackNavigator,
    navigationOptions: {
      //tabBarVisible: false
    }
  },
  Profile: {
    screen: ProfileStackNavigator
  }
});

const CouponNavigator = createStackNavigator({
  CouponTabNavigator: CouponTabNavigator
})

const AppDrawerNavigator = createDrawerNavigator({
  From: {
    screen: CouponTabNavigator
  },
  To: {
    screen: CouponTabNavigator
  },
  'My Coupons': {
    screen: CouponTabNavigator
  }
});

const AppSwitchNavigator = createSwitchNavigator({
  Login: { screen: LoginStackNavigator },
  Main: { screen: CouponTabNavigator }
});

export default createAppContainer(AppSwitchNavigator);

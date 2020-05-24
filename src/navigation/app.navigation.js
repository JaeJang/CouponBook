import React from 'react';
import { Text } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator, createBottomTabNavigator, createTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

import LoginScreen from '../screens/login.screen';
import FromScreen from '../screens/from/From.screen';
import ToScreen from '../screens/to/To.screen';
import MyCouponListScreen from '../screens/my/MyCouponList.screen';
import MyCouponScreen from '../screens/my/MyCoupon.screen';
import AddMyCouponListScreen from '../screens/my/AddMyCouponList.screen';
import NewCouponScreen from '../screens/my/NewCoupon.screen';
import ProfileScreen from '../screens/profile/Profile.screen';
import MyCouponListDetailScreen from '../screens/my/MyCouponListDetail.screen';
import ImportCouponScreen from '../screens/my/ImportCoupon.screen';
import ShareScreen from '../screens/my/Share.screen';
import FromDetailScreen from '../screens/from/FromDetail.screen';
import AlertCardScreen from '../screens/profile/AlertCard.screen';
import ToDetailScreen from '../screens/to/ToDetail.screen';

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
      screen: FromScreen,
      navigationOptions: () => ({
        headerShown: false
      })
    },
    'From Detail': {
      screen: FromDetailScreen
    }
  }
  /* {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerShown: false
      };
    }
  } */
);

const ToStackNavigator = createStackNavigator(
  {
    To: {
      screen: ToScreen
    },
    'To Detail': {
      screen: ToDetailScreen
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

const MyCouponTabNavigator = createStackNavigator(
  {
    'Coupon Lists': {
      screen: MyCouponListScreen,
      navigationOptions: () => ({})
    },
    Coupons: {
      screen: MyCouponScreen
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerShown: false
        /* tabBarOptions: {
          showIcon: true,
          showLabel: false,
          style: { backgroundColor: "#fff" }
        },
        tabBarIcon: ({focused, tintClolr}) => {
          const { routeName } = navigation.state;
          let iconName;
          if (routeName === "Coupon Lists") iconName = "md-albums";
          else if (routeName === "Coupons") iconName = "md-square"; 
          return <Icon name={iconName} size={20} style={{ color: focused ? "#00aaff" : "gray" }} />
        } */
      };
    }
  }
);

const MyCouponsStackNavigator = createStackNavigator({
  'My Coupons': {
    screen: MyCouponTabNavigator,
    navigationOptions: {}
  },
  'Add Coupon List': {
    screen: AddMyCouponListScreen,
    navigationOptions: {
      headerBackTitle: 'Back',
      title: 'Add New Coupon List'
    }
  },
  'New Coupon': {
    screen: NewCouponScreen
  },
  'Update Coupon': {
    screen: NewCouponScreen
  },
  'My Coupon List Detail': {
    screen: MyCouponListDetailScreen,
    navigationOptions: {
      headerShown: false
    }
  },
  'Import Coupon': {
    screen: ImportCouponScreen
  },
  Share: {
    screen: ShareScreen
  }
});

const ProfileStackNavigator = createStackNavigator({
  Profile: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      headerRight: () =>
        <Text style={{ marginRight: 10, color: '#00aaff', fontWeight: '600' }} onPress={navigation.getParam('logout')}>
          LOGOUT
        </Text>
    })
  },
  AlertCard: {
    screen: AlertCardScreen,
    navigationOptions: {
      headerShown: false
    }
  }
});

const CouponTabNavigator = createBottomTabNavigator(
  {
    From: {
      screen: FromStackNavigator,
      navigationOptions: {}
    },
    To: {
      screen: ToStackNavigator,
      navigationOptions: {}
    },
    My: {
      screen: MyCouponsStackNavigator,
      navigationOptions: {}
    },
    Profile: {
      screen: ProfileStackNavigator,
      navigationOptions: {}
    }
  },
  {
    resetOnBlur: true,
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarOptions: {
        showIcon: true,
        activeBackgroundColor: '#00aaff',
        activeTintColor: '#fff'
      },
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'From') iconName = 'md-log-in';
        else if (routeName === 'To') iconName = 'md-log-out';
        else if (routeName === 'My') iconName = 'md-filing';
        else if (routeName === 'Profile') iconName = 'md-person';
        return <Icon name={iconName} size={35} style={{ color: focused ? '#fff' : 'gray', marginTop: 3 }} />;
      }
    })
  }
);

const CouponNavigator = createStackNavigator({
  CouponTabNavigator: CouponTabNavigator
});

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

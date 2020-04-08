import React, { useRef } from 'react';
import { Animated, View, ScrollView, Text, Platform, StatusBar, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Icon } from 'native-base';
import PropTypes from 'prop-types';

import { timingAnimation } from '@utils/animation';

const HEADER_HEIGHT = Platform.OS === 'ios' ? 70 : 70 + StatusBar.currentHeight;

const CollapsibleHeader = ({ route,navigation, ...props }) => {
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const scrollHalf = useRef(new Animated.Value(0)).current;
  let currentOffset = 0;

  const transformY = scrollHalf.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT]
  });

  const onPressMyCouponLists = () => {
    if (route === 'Coupons') {
      navigation.navigate('Coupon Lists');
    }
  };

  const onPressMyCoupons = () => {
    if (route === 'Coupon Lists') {
      navigation.navigate('Coupons');
    }
  };

  const couponListsColor = route === 'Coupon Lists' ? '#00aaff' : '#000';
  const couponsColor = route === 'Coupons' ? '#00aaff' : '#000';
  return (
    <View style={{ flex: 1 }}>
      <FlatList 
        onScroll={e => {
          if (e.nativeEvent.contentOffset.y > currentOffset) {
            if (scrollHalf._value === 0) timingAnimation(scrollHalf, HEADER_HEIGHT, 200);
          } else {
            if (scrollHalf._value === HEADER_HEIGHT) timingAnimation(scrollHalf, 0, 200);
          }
        }}
        onScrollEndDrag={e => {
          if (e.nativeEvent.contentOffset > currentOffset) {
            //timingAnimation(scrollHalf, HEADER_HEIGHT, 200);
          }
          currentOffset = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
        data={props.list}
        showsHorizontalScrollIndicator={false}
        horizontal={false}
        keyExtractor={item => item.key}
        renderItem={props.renderItem}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
      />

      {/* <ScrollView
        
        onScroll={e => {
          if (e.nativeEvent.contentOffset.y > currentOffset) {
            if (scrollHalf._value === 0) timingAnimation(scrollHalf, HEADER_HEIGHT, 200);
          } else {
            if (scrollHalf._value === HEADER_HEIGHT) timingAnimation(scrollHalf, 0, 200);
          }
        }}
        onScrollEndDrag={e => {
          if (e.nativeEvent.contentOffset > currentOffset) {
            //timingAnimation(scrollHalf, HEADER_HEIGHT, 200);
          }
          currentOffset = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        <View style={{ paddingTop: HEADER_HEIGHT }}>
          {props.children}
        </View>
      </ScrollView> */}
      <Animated.View style={[styles.headerContainer, { transform: [{ translateY: transformY }] }]}>
        <TouchableOpacity onPress={onPressMyCouponLists}>
          <View style={[styles.tab]}>
            <Icon style={{ color: couponListsColor }} name="md-list" />
            <Text style={{ color: couponListsColor }}>My Coupon Lists</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressMyCoupons}>
          <View style={[styles.tab]}>
            <Icon style={{ color: couponsColor }} name="md-square-outline" />
            <Text style={{ color: couponsColor }}>My Coupons</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    height: HEADER_HEIGHT,
    width: '100%',
    overflow: 'hidden',
    zIndex: 999,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#cecece',
    borderBottomWidth: 1
  },
  tab: {
    alignItems: 'center'
  },
  selectedColor: {
    color: '#00aaff'
  }
});

CollapsibleHeader.propTypes = {
  route: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired
};

export default CollapsibleHeader;

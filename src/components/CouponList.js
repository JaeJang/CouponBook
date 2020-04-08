import React, { useState } from 'react';
import { FlatList, Image, View, Text } from 'react-native';
import firebase from 'firebase';
import _ from 'lodash';

import * as MyCouponService from '@service/MyCouponService';

import CouponCard from '@components/CouponCard';
import { EXPIRE } from '@constants';

import DefaultImage from '../images/default_image.png';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';

const CouponList = ({ list, ...props }) => {
  return (
    <FlatList
      data={list}
      showsHorizontalScrollIndicator={false}
      horizontal={false}
      keyExtractor={item => item.key}
      renderItem={({ item, index }) =>
        <CouponItem
          onDelete={() => {
            props.onDelete(index);
          }}
          onEditNumOfCoupons={() =>props.onEditNumOfCoupons(index)}
          item={item}
        />}
      style={props.listStye}
    />
  );
};

const InfoView = ({ item }) => {
  const createdAt = new Date(item.createdAt).toLocaleDateString();
  const expireOption = item.expireOption;
  return (
    <View>
      <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
        <Text style={{ fontSize: 25, fontWeight: '500' }}>
          {item.title}
        </Text>
        <Text style={{ color: 'gray' }}>
          {expireOption === EXPIRE.IN && `Expires in \n${item.expireIn.amount} ${item.expireIn.measure}`}
          {expireOption === EXPIRE.AT && `Expires at \n${new Date(item.expireAt).toLocaleDateString()}`}
        </Text>
      </View>
      <View style={{ marginTop: 5 }}>
        <Text style={{ fontWeight: '200' }}>
          {item.description}
        </Text>
        {/* <Text style={{ fontSize: 13, fontWeight: '200' }}>
          {item.email}
        </Text> */}
      </View>
    </View>
  );
};
const CouponItem = ({ item, ...props }) => {
  return (
      <CouponCard
        showXButton={true}
        numOfCoupons={_.get(item, 'numOfCoupons', 1)}
        item={item}
        onEditNumOfCoupons={() => props.onEditNumOfCoupons()}
        onPressX={() => {
          //MyCouponService.removeNewEntry(item);
          props.onDelete();
        }}
        image={item.image}
        infoView={() => <InfoView item={item} />}
      />
  );
};
export default CouponList;

import React, { useState } from 'react';
import { FlatList, Image, View, Text } from 'react-native';
import firebase from 'firebase';

import CouponCard from '@components/CouponCard';

const CouponList = ({ list, ...props }) => {
  return (
    <FlatList
      data={list}
      showsHorizontalScrollIndicator={false}
      horizontal={false}
      renderItem={({ item, index }) => <CouponItem item={item} />}
    />
  );
};

const ImageView = ({ url }) => {
  return (
    <Image
      source={{ uri: url }}
      style={{ height: 130, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
      resizeMode="cover"
    />
  );
};
const InfoView = ({ item }) => {
  return (
    <View>
      <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
        <Text style={{ fontSize: 25, fontWeight: '500' }}>
          {item.couponName}
        </Text>
        <Text style={{ color: 'gray' }}>
          {item.created}
        </Text>
      </View>
      <View style={{ marginTop: 5 }}>
        <Text style={{ fontWeight: '200' }}>
          {item.company}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: '200' }}>
          {item.email}
        </Text>
      </View>
    </View>
  );
};
const CouponItem = ({ item }) => {
  console.log(item);
  return <CouponCard imageView={() => <ImageView url={item.imageUrl} />} infoView={() => <InfoView item={item} />} />;
};
export default CouponList;

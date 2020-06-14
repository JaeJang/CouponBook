import React from 'react';
import { FlatList,  View, Text } from 'react-native';
import _ from 'lodash';

import CouponCard from '@components/CouponCard';
import { EXPIRE } from '@constants';

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
          props.onDelete();
        }}
        image={item.image}
        infoView={() => <InfoView item={item} />}
      />
  );
};
export default CouponList;

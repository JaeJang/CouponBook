import React, { useState, useRef } from 'react';
import { FlatList, View, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { Fab, Icon } from 'native-base';

import Card from './Card';
import { COUPON_STATUS } from '../constants';

const FromToDetail = ({
  coupons,
  type,
  onPressCard = () => {},
  onPressCardBack = () => {},
  onPressMainButton = () => {},
  onPressX = () => {},
  ...props
}) => {
  //const fabOpac = useRef(new Animated.Value(1)).current;
  const [scroll, setScroll] = useState(true);
  const [pressed, setPressed] = useState(false);
  const flatListRef = useRef();

  const onPress = () => {
    onPressCard();
    setPressed(true);
    setScroll(false);
    //Animated.timing(fabOpac, { toValue: 0 }).start();
  };
  const onPressBack = () => {
    onPressCardBack();
    setPressed(false);
    setScroll(true);
    //Animated.timing(fabOpac, { toValue: 1 }).start();
  };
  /* const scrollToOffset = offset => {
    flatListRef.current.scrollToOffset({ offset, animated: true });
  }; */

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        scrollEnabled={scroll}
        showsHorizontalScrollIndicator={false}
        horizontal={false}
        data={coupons.list}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => item.status !== COUPON_STATUS.DELETED &&
          <Card
            type={type}
            onPress={onPress}
            onPressBack={onPressBack}
            onPressMainButton={() => onPressMainButton(item, index)}
            onPressX={() => onPressX(coupons, index, item.title)}
            pressed={pressed}
            item={item}
            showXButton={props.showXButton !== undefined ? props.showXButton : false}
          />}
      />
      {!pressed &&
        <Fab
          active={false}
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: '#00aaff' }}
          position="bottomRight"
          onPress={scroll ? props.navigation.goBack : null}
        >
          <Icon type="Ionicons" name="ios-arrow-back" />
        </Fab>}
    </View>
  );
};

FromToDetail.propTypes = {
  coupons: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  onPressMainButton: PropTypes.func,
  onPressCard: PropTypes.func,
  onPressCardBack: PropTypes.func,
  onPressX: PropTypes.func,
  showXButton: PropTypes.bool
};

export default FromToDetail;

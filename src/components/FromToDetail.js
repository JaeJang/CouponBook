import React, { useState, useRef } from 'react';
import { FlatList, View, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { Fab, Icon } from 'native-base';

import Card from './Card';

const FromToDetail = ({
  list,
  type,
  onPressCard = () => {},
  onPressCardBack = () => {},
  onPressMainButton = () => {},
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
        data={list}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) =>
          <Card
            type={type}
            onPress={onPress}
            onPressBack={onPressBack}
            onPressMainButton={() => onPressMainButton(item, index)}
            pressed={pressed}
            item={item}
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
  list: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  onPressMainButton: PropTypes.func,
  onPressCard: PropTypes.func,
  onPressCardBack: PropTypes.func
};

export default FromToDetail;

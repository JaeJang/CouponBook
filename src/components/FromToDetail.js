import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';

import Card from './Card';

const FromToDetail = ({
  list,
  type,
  onPressCard = () => {},
  onPressCardBack = () => {},
  onPressMainButton = () => {},
  ...props
}) => {
  const [scroll, setScroll] = useState(true);
  const onPress = () => {
    onPressCard();
    setScroll(false);
  };
  const onPressBack = () => {
    onPressCardBack();
    setScroll(true);
  };

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
            item={item}
          />}
      />
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

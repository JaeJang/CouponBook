import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const CouponCard = ({ imageView, infoView, ...props }) => {
  return (
    <View style={[styles.container, props.containerStyle]}>
      <View style={[styles.image, props.imageContanierStyle]}>
        {imageView()}
      </View>
      <View style={[styles.info, props.infoContainerStyle]}>
        {infoView()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    display: 'flex'
  },
  image: {
    flex: 1
  },
  info: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20
  }
});

export default CouponCard;

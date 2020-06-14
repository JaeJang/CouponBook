import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Icon } from 'native-base';
import PropTypes from 'prop-types';

const CouponCard = ({ image, infoView, ...props }) => {
  const { showXButton, numOfCoupons } = props;
  return (
    <View style={[styles.container, props.containerStyle]}>
      <View style={[styles.image, props.imageContanierStyle]}>
        {image
          ? <Image
              source={{ uri: image }}
              style={{ height: 130, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
              resizeMode="cover"
            />
          : <Image
              source={DefaultImage}
              style={{ height: 130, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
              resizeMode="cover"
            />}
        {numOfCoupons &&
          <TouchableOpacity style={[styles.numberContainer]} onPress={props.onEditNumOfCoupons}>
            <Text style={[styles.number]}>
              {numOfCoupons}
            </Text>
          </TouchableOpacity>}

        {showXButton &&
          <TouchableOpacity style={[styles.xButtonContainer]} onPress={props.onPressX}>
            <Icon name="close" style={[styles.xButtonIcon]} />
          </TouchableOpacity>}
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
  },
  numberContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(175,175,175,0.8)',
    borderRadius: 50,
    alignSelf: 'flex-start',
    width: 35,
    height: 35,
    justifyContent: 'center',
    top: 5,
    left: 5
  },
  number: {
    textAlignVertical: 'center',
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    borderColor: '#000'
  },
  xButtonContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(175,175,175,0.8)',
    borderRadius: 50,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    top: 5,
    right: 5
  },
  xButtonIcon: {
    fontWeight: '800',
    textAlign: 'center',
    color: '#fff',
    fontSize: 35,
    width: 35,
    height: 35,
    borderColor: '#000'
  }
});

CouponCard.propTypes = {
  image: PropTypes.string
};

export default CouponCard;

import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import PropTypes from 'prop-types';

import Modal from '@components/Modal';
const NumOfCouponsModal = ({ list, visible, index,onLeftClick, onRightClick, ...props }) => {
  return (
    <Modal
      visible={visible}
      touchToClose={true}
      hasOpacityAnimation={true}
      hasTransformYAnimation={true}
      onDismiss={props.onDismiss}
    >
      <View style={[styles.container]}>
        <TouchableOpacity style={[styles.arrowTouchable]} onPress={() => onLeftClick(index)}>
          <Icon name="md-arrow-round-back" style={[styles.icon]} />
        </TouchableOpacity>
        <View style={[styles.numberDisplayContainer]}>
          <Text style={[styles.numberText]}>
            {list[index].numOfCoupons}
          </Text>
        </View>
        <TouchableOpacity style={[styles.arrowTouchable]} onPress={()=>{ onRightClick(index)}}>
          <Icon name="md-arrow-round-forward" style={[styles.icon]} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  arrowTouchable: {
    flex: 0.4,
    alignItems: 'center'
  },
  numberDisplayContainer: {
    flex: 0.2,
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: 'black'
  },
  numberText: {
    fontSize: 35,
    fontWeight: '600'
  },
  icon: {
    fontSize: 50,
    color: '#fff',
    shadowOpacity: 0.5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: 'black'
  }
});

NumOfCouponsModal.propTypes = {
  index: PropTypes.number.isRequired,
  list: PropTypes.array.isRequired,
  visible: PropTypes.bool.isRequired,
  onLeftClick: PropTypes.func.isRequired,
  onRightClick: PropTypes.func.isRequired
};
export default NumOfCouponsModal;

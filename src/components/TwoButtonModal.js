import React from 'react';
import Modal from '@components/Modal';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import PropTypes from 'prop-types';

const TwoButtonModal = ({ visible, onDismiss, onPressLeft, onPressRight, left, right, ...props }) => {
  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      hasOpacityAnimation={true}
      hasTransformYAnimation={true}
      touchToClose={true}
    >
      <View style={[styles.container]}>
        <View style={[styles.alignCenter]}>
          <TouchableOpacity style={[styles.customFab]} onPress={onPressLeft}>
            <Icon name={left.icon} style={[styles.white]} />
          </TouchableOpacity>
          <Text style={[styles.customFabText]}>{left.label}</Text>
        </View>
        <View style={[styles.alignCenter]}>
          <TouchableOpacity style={[styles.customFab]} onPress={onPressRight}>
            <Icon name={right.icon} style={[styles.white]} />
          </TouchableOpacity>
          <Text style={[styles.customFabText]}>{right.label}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  alignCenter: {
    alignItems:'center'
  },
  customFab: {
    backgroundColor: '#00aaff',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowRadius: 2,
    shadowOffset: { widht: 1, height: 1 },
    shadowOpacity: 0.4
  },
  white: {
    color: '#fff'
  },
  customFabText: {
    color: '#fff',
    fontWeight: '500'
  },

});

TwoButtonModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func,
  onPressLeft: PropTypes.func.isRequired,
  onPressRight: PropTypes.func.isRequired,
  left: PropTypes.object.isRequired,
  right: PropTypes.object.isRequired
};

export default TwoButtonModal;

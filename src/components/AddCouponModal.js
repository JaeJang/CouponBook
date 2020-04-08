import React from 'react';
import Modal from '@components/Modal';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import PropTypes from 'prop-types';

const AddCouponModal = ({ visible, onDismiss, onImport, onNew, ...props }) => {
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
          <TouchableOpacity style={[styles.customFab]}>
            <Icon name="md-search" style={[styles.white]} />
          </TouchableOpacity>
          <Text style={[styles.customFabText]}>Import</Text>
        </View>
        <View style={[styles.alignCenter]}>
          <TouchableOpacity style={[styles.customFab]} onPress={onNew}>
            <Icon name="md-add" style={[styles.white]} />
          </TouchableOpacity>
          <Text style={[styles.customFabText]}>Create New</Text>
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

AddCouponModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func,
  onImport: PropTypes.func.isRequired,
  onNew: PropTypes.func.isRequired
};

export default AddCouponModal;

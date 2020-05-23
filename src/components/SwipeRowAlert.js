import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import { Icon } from 'native-base';
import PropTypes from 'prop-types';
import moment from 'moment';

import { ALERT_TYPE, COUPON_STATUS } from '../constants';

const SwipeRowAlert = ({ item, onRowPress, onDelete, ...props }) => {
  const [swiped, setSwiped] = useState(false);
  const onPress = () => {
    if (!swiped && item.type !== ALERT_TYPE.DELETED) {
      onRowPress(item);
    }
  };
  return (
    <SwipeRow
      leftOpenValue={75}
      rightOpenValue={-55}
      disableRightSwipe={true}
      onRowOpen={() => setSwiped(true)}
      onRowClose={() => setSwiped(false)}

      style={{ marginBottom: 5 }}
    >
      <TouchableWithoutFeedback onPress={() => onDelete(item.alertKey)}>
        <View style={styles.standaloneRowBack}>
          <Icon name="md-checkmark-circle-outline" style={[{}, styles.backTextWhite]} />
          <Icon name="md-remove-circle" style={styles.backTextWhite} />
        </View>
      </TouchableWithoutFeedback>
      <TouchableHighlight onPress={!swiped ? onPress : null}>
        <View style={styles.standaloneRowFront}>
          {item.type === ALERT_TYPE.REQUESTED &&
            <View>
              <Text>
                {item.name} wants to use {item.title}
                <Text style={{ fontSize: 10, marginLeft: 5 }}>({moment(item.date).format('MM/DD h:mm a')})</Text>
              </Text>
            </View>}
          {item.type === ALERT_TYPE.CONFIRMED &&
            <View>
              <Text>
                {item.name} confirmed {item.title}
                <Text style={{ fontSize: 10, marginLeft: 5 }}>({moment(item.date).format('MM/DD h:mm a')})</Text>
              </Text>
            </View>}
          {item.type === ALERT_TYPE.DELETED &&
            <View>
              <Text>
                {item.name} deleted {item.title} list
                <Text style={{ fontSize: 10, marginLeft: 5 }}>({moment(item.date).format('MM/DD h:mm a')})</Text>
              </Text>
            </View>}
        </View>
      </TouchableHighlight>
    </SwipeRow>
  );
};

const styles = {
  standaloneRowFront: {
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    height: 50,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderWidth: 0.5,
    borderRadius: 5,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  standaloneRowBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 5
  },
  backTextWhite: {
    color: '#FFF',
    fontSize: 22
  }
};

SwipeRowAlert.propTypes = {
  item: PropTypes.object.isRequired,
  onRowPress: PropTypes.func,
  onDelete: PropTypes.func.isRequired
};

export default SwipeRowAlert;

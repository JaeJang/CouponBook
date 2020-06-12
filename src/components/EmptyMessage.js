import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

const EmptyMessage = ({ message, ...props }) => {
  return (
    <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, props.containerStyle]}>
      <Text
        style={[
          {
            marginTop: 0,
            marginLeft: 20,
            color: 'gray',
            fontSize: 20
          },
          props.textStyle
        ]}
      >
        {message}
      </Text>
    </View>
  );
};

EmptyMessage.propTypes = {
  message: PropTypes.string.isRequired
};

export default EmptyMessage;

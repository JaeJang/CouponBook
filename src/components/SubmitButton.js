import React from 'react';
import { Button, Text } from 'native-base';
import PropTypes from 'prop-types';

const style = {
  backgroundColor: '#00aaff',
  justifyContent: 'center'
};

const SubmitButton = ({ onPress, label = 'SAVE', ...props }) => {
  return (
    <Button style={[style, props.style]} onPress={onPress}>
      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>
        {label}
      </Text>
    </Button>
  );
};

SubmitButton.propTypes = {
  onPress: PropTypes.func.isRequired
};

export default SubmitButton;

import React, {Component} from 'react';

import {Text} from 'react-native';
export default function(props) {
  return (
    <Text
      style={{color: props.colorText, fontSize: props.sizeText, marginTop: 10}}>
      {props.textLoader}
    </Text>
  );
}

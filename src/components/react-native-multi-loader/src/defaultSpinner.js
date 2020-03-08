import React from 'react';
import {ActivityIndicator} from 'react-native';

export default function(props) {
  return (
    <ActivityIndicator size={props.sizeLoader} color={props.colorLoader} />
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, Platform, TouchableOpacity, Text, Animated, View } from 'react-native';
import { Icon } from 'native-base';
import RootComponent from './RootComponent';


const CardButtonBase = ({...props}) => {

  useEffect(() => {
    return () => {
      if (props.onDismiss) {
        props.onDismiss();
      }
    }
  })
  if (props.visible) {
    return (
      <TouchableOpacity style={{position: 'absolute'}} disabled={props.disableButton} onPressIn={props.onPressMainButton}>
        <View  >
          {props.renderButtonLabel()}
        </View>
      </TouchableOpacity>
    )
  }
  return null;
}

const CardButton = ({...props}) => {
  return <RootComponent {...props} renderComponent={CardButtonBase}  />
}

export default CardButton;
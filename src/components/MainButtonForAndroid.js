import React, { Component, useState, useEffect, useRef } from 'react';
import { Dimensions, Platform, TouchableOpacity, Text, Animated } from 'react-native';
import RootComponent from './RootComponent';

const MainButtonForAndroidBase = ({ ...props }) => {

}

const MainButtonForAndroid = ({...props}) => {
  return <RootComponent {...props} renderComponent={MainButtonForAndroidBase} />;
}

export default MainButtonForAndroid;

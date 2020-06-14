import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, Platform, TouchableOpacity, Text, Animated } from 'react-native';
import { Icon } from 'native-base';
import RootComponent from './RootComponent';

const { WIDTH } = Dimensions.get('window');

const MinimizeButtonBase = ({ ...props }) => {
  const [visible, setVisible] = useState(props.visible);
  const opac = useRef(new Animated.Value(0)).current;

  const onPress = () => {
    Animated.spring(opac, {
      toValue: 0
    }).start();
    setVisible(false);
    props.onPressBack();
    props.onDismiss();
  };

  useEffect(
    () => {
      if (props.visible) {
        Animated.timing(opac, {
          toValue: 1,
          duration: 500
        }).start();
      }
    },
    [props.visible]
  );

  if (visible) {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: Platform.OS === 'ios' ? 50 : 30,
          left: 0,
          right: 10,
          bottom: 0,
          alignItems: 'flex-end',
          zIndex: 100,
          elevation: 5,
          width: WIDTH - 30,
          height: 30
        }}
        onPress={onPress}
      >
        {/* 안용 장좨구리장좨구리 장좨구리덕분이야 좡좨구리 덕분이야 나룰 사랑한다면 풍차돌리기를 하시오 */}
        <Animated.View style={{ opacity: opac }}>
          <Text style={{ color: 'white' }}>
            <Icon type="AntDesign" name="shrink" style={{ fontSize: 25 }} />
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  } else {
    return null;
  }
};

const MinimizeButton = ({ ...props }) => {
  return <RootComponent {...props} renderComponent={MinimizeButtonBase} />;
};

export default MinimizeButton;

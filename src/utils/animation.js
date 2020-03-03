import { Animated } from 'react-native';

export const timingAnimation = async (value, toValue = 1, duration = 1000) => {
  Animated.timing(value, {
    toValue: toValue,
    duration: duration
  }).start();
};

import React, { useEffect } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { sleep } from '@utils/sleep';

const name = ['A', 'O', 'A', 'A', 'A', 'A', ' B', 'O', 'O', 'K'];

const AnimatedName = ({ props }) => {
  const animated = [];
  const opacities = [];
  for (let i = 0; i < 10; ++i) {
    let ani = new Animated.Value(0);
    animated.push(ani);
    opacities.push(
      ani.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [0, 0.25, 0.5, 0.75, 1]
      })
    );
  }

  useEffect(() => {
    let startAnimate = async () => {
      for (let ani of animated) {
        Animated.timing(ani, {
          toValue: 1,
          duration: 1000
        }).start();
        await sleep(0);
      }
    };
    startAnimate();
  }, []);

  return (
    <Animated.View style={{ flexDirection: 'row' }}>
      {opacities.map((opacity, index) =>
        <Animated.Text style={[styles.text, { opacity }]} key={index}>
          {name[index]}
        </Animated.Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 40,
    fontWeight: 'bold'
  }
});

export default AnimatedName;

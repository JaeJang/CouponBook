import React, { useEffect } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { sleep } from '@utils/sleep';
import { timingAnimation } from '@utils/animation';
const name = ['E', 'L', 'L', 'I', 'E', '\'','S', ' B', 'O', 'O', 'K'];
const colors = [
  '#FE0302',
  '#FF7E39',
  '#FFFF01',
  '#00B04F',
  '#2EB8EE',
  '#2EB8EE',
  '#002060',
  '#FE0302',
  '#FF7E39',
  '#FF7E39',
  '#00B04F'
]
const AnimatedName = ({ ...props }) => {
  const animated = [];
  const opacities = [];
  for (let i = 0; i < 11; ++i) {
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
        timingAnimation(ani);
        //await sleep(100);
        await sleep(100);
      }
    };
    startAnimate();
  }, []);

  return (
    <Animated.View style={{ flexDirection: 'row', backgroundColor:'rgba(0,0,0,0.4)', borderRadius: 10, paddingHorizontal: 30, paddingVertical: 5 }}>
      {opacities.map((opacity, index) =>
        <Animated.Text style={[styles.text, { opacity, color: colors[index] }]} key={index}>
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

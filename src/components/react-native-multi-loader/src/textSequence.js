import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Animated } from 'react-native';

export default class animations extends Component {
  constructor(props) {
    super(props);
    this.arr = this.props.textLoader.split('');
    this.animatedValue = [];
    this.arr.forEach((value, index) => {
      this.animatedValue[index] = new Animated.Value(0);
    });
  }

  componentDidMount() {
    this.animate();
  }

  animate() {
    const animations = this.arr.map((a, i) =>
      Animated.timing(this.animatedValue[i], {
        toValue: 1,
        duration: 500,
      }),
    );
    Animated.loop(Animated.sequence(animations)).start();
  }

  myHeight = ani => {
    const minSize = this.props.sizeText;
    return ani.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [minSize, minSize * 2, minSize],
    });
  };

  myMargin = ani => {
    const minSize = this.props.sizeText / 2 + 2;
    return ani.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [minSize, 0, minSize],
    });
  };

  render() {
    const animations = this.arr.map((a, i) => {
      return (
        <Animated.Text
          key={i}
          style={{
            marginTop: this.myMargin(this.animatedValue[i]),
            marginBottom: this.myMargin(this.animatedValue[i]),
            fontSize: this.myHeight(this.animatedValue[i]),
            marginLeft: 3,
            fontWeight: 'bold',
            color: this.props.colorText,
          }}
        >
          {a}
        </Animated.Text>
      );
    });
    return <View style={styles.container}>{animations}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

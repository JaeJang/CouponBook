import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Animated } from 'react-native';

const arr = [];
for (var i = 0; i < 5; i++) {
  arr.push(i);
}

export default class animations extends Component {
  constructor() {
    super();
    this.animatedValue = [];
    arr.forEach(value => {
      this.animatedValue[value] = new Animated.Value(0);
    });
  }

  componentDidMount() {
    this.animate();
  }

  animate() {
    const animations = arr.map(v =>
      Animated.timing(this.animatedValue[v], {
        toValue: 1,
        duration: 500,
      }),
    );
    Animated.loop(Animated.sequence(animations)).start();
  }

  viewHeight = animatedView => {
    const maxHeight = this.props.sizeLoader === 'large' ? 50 : 30;
    const minHeight = this.props.sizeLoader === 'large' ? 20 : 10;
    return animatedView.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [minHeight, maxHeight, minHeight],
    });
  };

  viewRadius = animatedView => {
    const maxHeight = this.props.sizeLoader === 'large' ? 25 : 15;
    const minHeight = this.props.sizeLoader === 'large' ? 10 : 5;
    return animatedView.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [minHeight, maxHeight, minHeight],
    });
  };

  viewMargin = animatedView => {
    const maxMargin = this.props.sizeLoader === 'large' ? 15 : 10;
    return animatedView.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [maxMargin, 0, maxMargin],
    });
  };

  render() {
    const animations = arr.map((a, i) => (
      <Animated.View
        key={i}
        style={{
          marginTop: this.viewMargin(this.animatedValue[a]),
          marginBottom: this.viewMargin(this.animatedValue[a]),
          height: this.viewHeight(this.animatedValue[a]),
          width: this.viewHeight(this.animatedValue[a]),
          borderRadius: this.viewRadius(this.animatedValue[a]),
          backgroundColor: this.props.colorLoader,
          marginLeft: 3,
        }}
      />
    ));
    return <View style={styles.container}>{animations}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

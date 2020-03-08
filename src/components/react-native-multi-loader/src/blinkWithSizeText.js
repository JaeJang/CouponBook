import React, {Component} from 'react';
import {Animated, View} from 'react-native';

export default class Text extends Component {
  constructor() {
    super();
    this.animatedValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.animate();
  }

  animate() {
    this.animatedValue.setValue(0);
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 1000,
      //   easing: Easing.linear,
    }).start(() => this.animate());
  }

  render() {
    const minSize = this.props.sizeText;
    const minMargin = this.props.sizeText / 2 + 1;
    const opacity = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 0],
    });

    const textSize = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [minSize, minSize * 2, minSize],
    });

    const margin = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [minMargin, 0, minMargin],
    });

    return (
      <View>
        <Animated.Text
          style={{
            opacity,
            fontSize: textSize,
            marginTop: margin,
            marginBottom: margin,
            color: this.props.colorText,
          }}>
          {this.props.textLoader}
        </Animated.Text>
      </View>
    );
  }
}

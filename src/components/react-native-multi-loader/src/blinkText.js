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
    const opacity = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 0],
    });

    const textSize = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [18, 36, 18],
    });

    const margin = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [10, 0, 10],
    });

    return (
      <View>
        <Animated.Text
          style={{
            fontSize: 20,
            marginTop: 10,
            color: this.props.colorText,
            opacity,
            fontSize: this.props.sizeText,
          }}>
          {this.props.textLoader}
        </Animated.Text>
      </View>
    );
  }
}

import React, { useState, Component, useEffect, useRef } from 'react';
import {
  Platform,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated
} from 'react-native';
import Sibling from 'react-native-root-siblings';
import { Content } from 'native-base';
import _ from 'lodash';

import { timingAnimation } from '@utils/animation';
import { sleep } from '@utils/sleep';
import RootComponent from './RootComponent';
/*
In current react native for ios, Alert disappears when modal from react-native-modal is being closed.
Becasue of that reason, we can use react-native-modal in Android but need to create a new modal 
for iOS to keep both alert and modal displaying.
*/

// PARAM: width - user defined width(1 -> 100%)
// PARAM: height - user defined height(1 -> 100%)
// Calculate modals width and height with user defined and screen size
const modalSize = (width, height) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  if (width && width > 0.0 && width <= 1.0) {
    width *= screenWidth;
  }
  if (height && height > 0.0 && height <= 1.0) {
    height *= screenHeight;
  }
  return { width, height };
};

const getOutputRange = height => {
  const partial = height / 5;
  return [height, height - partial, height - partial * 2, height - partial * 3, height - partial * 2, 0];
};

// Base Modal for ios
const Modal_IOS_Base = ({ width = 1, ...props }) => {
  const touchToClose = _.get(props, 'touchToClose', false);
  const [opacity, setOpacity] = useState(0);
  const [visible, setVisible] = useState(props.visible);
  const size = modalSize(width, props.height);
  const containerOpacityValue = useRef(new Animated.Value(0)).current;
  const contentOpacityValue = useRef(new Animated.Value(0)).current;
  const transformYValue = useRef(new Animated.Value(0)).current;
  const transformXValue = useRef(new Animated.Value(0)).current;

  const hasOpacityAnimation = _.get(props, 'hasOpacityAnimation', false);
  const hasTransformYAnimation = _.get(props, 'hasTransformYAnimation', false);
  const hasTransformXAnimation = _.get(props, 'hasTransformXAnimation', false);
  const opacityTiming = _.get(props, 'opacityTiming', 1000);
  const transformTiming = _.get(props, 'transformTiming', 700);

  const inputRange = [0, 1];
  const outputRangeContainer = [0, 0.6];
  const outputRangeContent = [0, 1];
  const outputRangeTransform = [300, 0];
  const containerOpacity = containerOpacityValue.interpolate({
    inputRange: inputRange,
    outputRange: visible ? outputRangeContainer : outputRangeContainer.reverse()
  });

  const contentOpacity = contentOpacityValue.interpolate({
    inputRange: inputRange,
    outputRange: visible ? outputRangeContent : outputRangeContent.reverse()
  });

  const transformY = transformYValue.interpolate({
    inputRange: inputRange,
    outputRange: visible ? outputRangeTransform : outputRangeTransform.reverse()
  });

  const transformX = transformXValue.interpolate({
    inputRange: inputRange,
    outputRange: visible ? outputRangeTransform : outputRangeTransform.reverse()
  });

  const dimissModal = async () => {
    if (hasOpacityAnimation) {
      timingAnimation(containerOpacityValue, 0, opacityTiming);
      timingAnimation(contentOpacityValue, 0, opacityTiming);
    }
    if (hasTransformYAnimation) timingAnimation(transformYValue, 0, transformTiming);
    if (hasTransformXAnimation) timingAnimation(transformXValue, 0, transformTiming);
    await sleep(500);
    setVisible(false);
    props.onDismiss();
  };

  useEffect(
    () => {
      if (props.visible) {
        if (hasOpacityAnimation) {
          timingAnimation(containerOpacityValue, 1, opacityTiming);
          timingAnimation(contentOpacityValue, 1, opacityTiming);
        }
        if (hasTransformYAnimation) timingAnimation(transformYValue, 1, transformTiming);
        if (hasTransformXAnimation) timingAnimation(transformXValue, 1, transformTiming);

        setVisible(true);
      } else {
        dimissModal();
      }
    },
    [props.visible]
  );

  /*   useEffect(
    () => {
      if (visible) {
        if (hasOpacityAnimation) {
          timingAnimation(containerOpacityValue, 1, opacityTiming);
          timingAnimation(contentOpacityValue, 1, opacityTiming);
        }
        if (hasTransformYAnimation) timingAnimation(transformYValue, 1, transformTiming);
        if (hasTransformXAnimation) timingAnimation(transformXValue, 1, transformTiming);
      } else {
       console.log(containerOpacityValue._value);
        if (hasOpacityAnimation) {
          timingAnimation(containerOpacityValue, 0, opacityTiming);
          timingAnimation(contentOpacityValue, 0, opacityTiming);
        }
        if (hasTransformYAnimation) timingAnimation(transformYValue, 0, transformTiming);
        if (hasTransformXAnimation) timingAnimation(transformXValue, 0, transformTiming); 
      }
    },
    [visible]
  ); */

  if (visible) {
    return (
      <Animated.View style={[StyleSheet.absoluteFill, styles.container, props.containerStyle]}>
        <View style={[styles.content]}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              size,
              {
                backgroundColor: '#000',
                opacity: hasOpacityAnimation ? containerOpacity : 0.5,
                transform: [
                  { translateY: hasTransformYAnimation ? transformY : 0 },
                  { translateX: hasTransformXAnimation ? transformX : 0 }
                ]
              }
            ]}
          >
            <TouchableOpacity style={[StyleSheet.absoluteFill]} />
          </Animated.View>
          <TouchableWithoutFeedback
            onPress={() => {
              if (touchToClose) {
                dimissModal();
              }
            }}
          >
            <View style={{}}>
              <View style={[styles.modal, size, props.modalStyle]}>
                <Animated.View
                  style={[{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    opacity: hasOpacityAnimation ? contentOpacity : 1,
                    transform: [
                      { translateY: hasTransformYAnimation ? transformY : 0 },
                      { translateX: hasTransformXAnimation ? transformX : 0 }
                    ]
                  },  props.modalStyle]}
                >
                  {props.children}
                </Animated.View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Animated.View>
    );
  } else {
    return null;
  }
};

const CustomModal = ({ ...props }) => {
  return <RootComponent {...props} renderComponent={Modal_IOS_Base} />;
};

export default CustomModal;

// Modal for ios
// Place modal on top of other components using sibling
class Modal_IOS extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.visible) {
      this.createModal();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.createModal();
      }
    }
    if (this.sibling) {
      this.updateModal();
    }
  }

  componentWillUnmount() {
    if (this.sibling) {
      this.sibling.destroy();
      this.sibling = null;
    }
  }

  createModal = () => {
    if (!this.sibling) {
      this.sibling = new Sibling(this.renderModal());
    }
  };

  updateModal = () => {
    this.sibling.update(this.renderModal());
  };

  onDismiss = () => {
    if (this.sibling) {
      this.sibling.destroy();
    }
    this.sibling = null;
    if (this.props.onDismiss) {
      this.props.onDismiss();
    }
  };

  renderModal = () => {
    return <Modal_IOS_Base {...this.props} onDismiss={this.onDismiss} width={1} />;
  };

  render() {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    elevation: 10
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    flex: 1,
    overflow: 'hidden'
  }
});

//export default (Platform.OS === 'ios' ? Modal_IOS : Modal);

import React, { useState, Component, useEffect } from 'react';
import { Platform, StyleSheet, Dimensions, View, TouchableOpacity, Modal } from 'react-native';
import Sibling from 'react-native-root-siblings';
import { Content } from 'native-base';
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

// Base Modal for ios
const Modal_IOS_Base = ({ ...props }) => {
  const [opacity, setOpacity] = useState(0);
  const size = modalSize(props.width, props.height);

  useEffect(
    () => {
      if (props.visible) {
        setOpacity(0.1);
      } else {
        setOpacity(0);
        props.onDismiss();
      }
    },
    [props.visible]
  );

  if (props.visible) {
    return (
      <View style={[styles.container, props.containerStyle]}>
        <View style={[styles.content]}>
          <View style={[StyleSheet.absoluteFill, size, { backgroundColor: '#000', opacity: opacity }]}>
            <TouchableOpacity style={[StyleSheet.absoluteFill]} />
          </View>
          <View style={{}}>
            <View style={[styles.modal, size, props.modalStyle]}>
              <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                {props.children}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  } else {
    return null;
  }
};

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
    this.sibling.destroy();
    this.sibling = null;
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
    ...StyleSheet.absoluteFillObject,
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

export default (Platform.OS === 'ios' ? Modal_IOS : Modal);

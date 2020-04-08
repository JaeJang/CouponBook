import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  ImageBackground
} from 'react-native';
import { Icon } from 'native-base';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { CARD_TYPE, EXPIRE } from '@constants';

import DefaultImage from '../images/default_image.png';

const { width, height } = Dimensions.get('window');

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pressedStyle: {},

      orgWidth: width - 32,
      orgHeight: height / 5,

      topBorderRadius: 5,
      bottomBorderRaidus: 0,

      pressed: false,

      offset: 0
    };

    this.topWidth = new Animated.Value(width - 32);
    this.topHeight = new Animated.Value(height / 5);
    this.bottomWidth = new Animated.Value(width - 32);
    this.bottomHeight = new Animated.Value(height / 9);
    this.contentHeight = new Animated.Value(0);

    this.topPan = new Animated.ValueXY();
    this.bottomPan = new Animated.ValueXY();
    this.contentPan = new Animated.ValueXY();

    this.contentOpac = new Animated.Value(0);
    this.buttonOpac = new Animated.Value(0);
    this.backOpac = new Animated.Value(0);
    this.plus = new Animated.Value(1);
  }

  onPress = () => {
    if (this.props.onPress) this.props.onPress();
    if (this.props.type === CARD_TYPE.COUPON) {
      this.setState({ pressed: !this.state.pressed });
      this.calculateOffset();
    }
  };

  grow = () => {
    this.setState({ topBorderRadius: 0, bottomBorderRadius: 5 });

    Animated.parallel([
      Animated.spring(this.topWidth, {
        toValue: width
      }).start(),
      Animated.spring(this.topHeight, {
        toValue: height / 2
      }).start(),
      Animated.spring(this.bottomHeight, {
        toValue: height / 9 + 50
      }).start(),
      Animated.spring(this.contentHeight, {
        toValue: height / 2
      }).start(),
      Animated.spring(this.topPan, {
        toValue: {
          x: 0,
          y: -this.state.offset
        }
      }).start(),
      Animated.spring(this.contentPan, {
        toValue: {
          x: 0,
          y: -(height / 8 + this.state.offset)
        }
      }).start(),
      Animated.spring(this.bottomPan, {
        toValue: {
          x: 0,
          y: -(50 + this.state.offset)
        }
      }).start(),

      Animated.timing(this.contentOpac, {
        toValue: 1
      }).start(),
      Animated.timing(this.buttonOpac, {
        toValue: 1
      }).start(),
      Animated.timing(this.backOpac, {
        toValue: 1
      }).start(),
      Animated.timing(this.plus, {
        toValue: 0
      }).start()
    ]);
  };
  shrink = () => {
    this.setState({ TopBorderRadius: 5, BottomBorderRadius: 0 });
    if (this.props.onPressBack) this.props.onPressBack();
    Animated.parallel([
      Animated.spring(this.topWidth, {
        toValue: this.state.orgWidth
      }).start(),
      Animated.spring(this.topHeight, {
        toValue: this.state.orgHeight
      }).start(),
      Animated.spring(this.bottomHeight, {
        toValue: height / 9
      }).start(),
      Animated.spring(this.topPan, {
        toValue: {
          x: 0,
          y: 0
        }
      }).start(),
      Animated.spring(this.bottomPan, {
        toValue: {
          x: 0,
          y: 0
        }
      }).start(),
      Animated.spring(this.contentHeight, {
        toValue: 0
      }).start(),
      Animated.timing(this.contentOpac, {
        toValue: 0
      }).start(),
      Animated.timing(this.buttonOpac, {
        toValue: 0
      }).start(),
      Animated.timing(this.backOpac, {
        toValue: 0
      }).start(),
      Animated.timing(this.plus, {
        toValue: 1
      }).start()
    ]);
  };

  calculateOffset = () => {
    if (this.refs.container) {
      this.refs.container.measure((fx, fy, width, height, px, py) => {
        this.setState({ offset: py }, () => {
          if (this.state.pressed) {
            this.grow();
          } else {
            this.shrink();
          }
        });
      });
    }
  };

  renderTop = () => {
    const back = this.state.pressed
      ? <TouchableOpacity style={[styles.backButton]} onPress={this.onPress}>
          <Animated.View style={{ opacity: this.backOpac }}>
            <Text style={{ color: 'white' }}>
              <Icon name="md-arrow-back" />
            </Text>
          </Animated.View>
        </TouchableOpacity>
      : <View />;

    const borderStyles = !this.state.pressed
      ? { borderRadius: this.state.topBorderRadius, borderBottomLeftRadius: 0 }
      : { borderTopRightRadius: this.state.topBorderRadius, borderTopLeftRadius: this.state.topBorderRadius };

    const imageContent = this.props.item.image
      ? <Animated.Image
          source={{ uri: this.props.item.image }}
          style={[
            styles.top,
            borderStyles,
            { width: this.topWidth, height: this.topHeight, transform: this.topPan.getTranslateTransform() }
          ]}
        />
      : <Animated.Image source={DefaultImage} style={{ width: '100%', height: '100%' }} />;
    const image = this.props.item.image ? { uri: this.props.item.image } : DefaultImage;
    return (
      <Animated.View
        style={[
          styles.top,
          borderStyles,
          { width: this.topWidth, height: this.topHeight, transform: this.topPan.getTranslateTransform() }
        ]}
      >
        {/* {imageContent} */}
        <ImageBackground source={image} style={{ width: '100%', height: '100%' }}>
          {back}
          {this.props.item.numOfCoupons &&
            !this.state.pressed &&
            <TouchableOpacity
              style={[styles.numberContainer]}
              onPress={this.props.onEditNumOfCoupons ? this.props.onEditNumOfCoupons : null}
            >
              <Text style={[styles.number]}>
                {this.props.item.numOfCoupons}
              </Text>
            </TouchableOpacity>}
          {this.props.showXButton &&
            !this.state.pressed &&
            <TouchableOpacity
              style={[styles.xButtonContainer]}
              onPress={this.props.onPressX ? this.props.onPressX : null}
            >
              <Icon name="close" style={[styles.xButtonIcon]} />
            </TouchableOpacity>}
        </ImageBackground>
      </Animated.View>
    );
  };

  renderBottom = () => {
    /* var plusButton = !this.state.activated
        ?
    <Animated.View style={{opacity: this.state.plus, justifyContent: 'center', alignItems: 'center'}}>
        <Icon name='plus-circle' style={{fontSize: 24, color: this.props.color}}/>
    </Animated.View>
        :
        <Animated.View style={{opacity: this.state.plus, justifyContent: 'center', alignItems: 'center'}}>
        <Icon name='check-circle' style={{fontSize: 24, color: this.props.color}}/>
    </Animated.View> */
    const { expireOption, expireIn, expireAt, title } = this.props.item;
    return (
      <Animated.View
        style={[
          styles.bottom,
          {
            width: this.bottomWidth,
            height: this.bottomHeight,
            borderRadius: this.bottomBorderRadius,
            transform: this.bottomPan.getTranslateTransform()
          }
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{}}>
            <Text style={{ fontSize: 24, fontWeight: '700', paddingBottom: 8 }}>
              {title}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: 'gray' }}>
              {expireOption === EXPIRE.IN && `Expires in ${expireIn.amount} ${expireIn.measure}`}
              {expireOption === EXPIRE.AT && `Expires at ${new Date(expireAt).toLocaleDateString()}`}
            </Text>
          </View>

          {/* {plusButton} */}
        </View>
        {this.state.pressed &&
          <TouchableOpacity>
            <Animated.View
              style={{
                opacity: this.buttonOpac,
                backgroundColor: '#00aaff',
                marginTop: 10,
                borderRadius: 10,
                width: width - 64,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text style={{ color: 'white', fontWeight: '800', fontSize: 18 }}>Request</Text>
            </Animated.View>
          </TouchableOpacity>}
      </Animated.View>
    );
  };

  renderContent = () => {
    if (!this.state.pressed) {
      return;
    }
    return (
      <Animated.View
        style={{
          opacity: this.contentOpac,
          width: width,
          height: this.contentHeight,
          zIndex: -1,
          backgroundColor: 'rgb(242, 242, 242)',
          transform: this.contentPan.getTranslateTransform(),
          marginTop: 30
        }}
      >
        <View style={{ backgroundColor: 'white', flex: 1, margin: 16, padding: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: 'black' }}>Description</Text>
          <Text style={{ paddingTop: 10 }}>
            {this.props.item.description}
          </Text>
          {this.props.item.note
            ? <Text style={{ fontStyle: 'italic', padding: 5, color: 'gray' }}>
                Note: {this.props.item.note}
              </Text>
            : null}
        </View>
      </Animated.View>
    );
  };

  render() {
    return (
      <View style={[styles.container, this.state.pressedStyle]}>
        <TouchableWithoutFeedback onPress={!this.state.pressed ? this.onPress : null} style={{}}>
          <View ref="container" style={[{ alignItems: 'center' }]}>
            {this.props.item.used &&
              !this.state.pressed &&
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: 'rgba(255,255,255,0.6)', top: 0, left: 0, position: 'absolute', zIndex: 10 }
                ]}
              />}
            {this.renderTop()}
            {this.renderBottom()}
            {this.renderContent()}
            {this.props.type === CARD_TYPE.LIST ? <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  top: -10,
                  left: 10,
                  right: -10,
                  bottom: 10,
                  position: 'absolute',
                  borderBottomRightRadius:5,
                  zIndex: -1
                }
              ]}
            /> : null}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    marginTop: 16
  },
  backButton: {
    position: 'absolute',
    top: -120,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  top: {
    marginBottom: 0,
    backgroundColor: 'blue'
  },
  bottom: {
    marginTop: 0,
    padding: 16,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: '#fff'
  },
  numberContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(175,175,175,0.8)',
    borderRadius: 50,
    alignSelf: 'flex-start',
    width: 35,
    height: 35,
    justifyContent: 'center',
    top: 5,
    left: 5
  },
  number: {
    textAlignVertical: 'center',
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    borderColor: '#000'
  },
  xButtonContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(175,175,175,0.8)',
    borderRadius: 50,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    top: 5,
    right: 5
  },
  xButtonIcon: {
    fontWeight: '800',
    textAlign: 'center',
    color: '#fff',
    fontSize: 35,
    width: 35,
    height: 35,
    borderColor: '#000'
  }
});

Card.propTypes = {
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  onPress: PropTypes.func,
  onEditNumOfCoupons: PropTypes.func,
  onPressX: PropTypes.func
};

export default Card;

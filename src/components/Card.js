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
  ImageBackground,
  TextInput,
  Alert
} from 'react-native';
import { Icon } from 'native-base';
import PropTypes from 'prop-types';
import _ from 'lodash';
import CachedImage from 'react-native-image-cache-wrapper';
import Toast from 'react-native-simple-toast';

import SubmitButton from './SubmitButton';
import Modal from './Modal';

import * as MyCouponService from '../services/MyCouponService';
import { CARD_TYPE, EXPIRE, LIST_STATUS, COUPON_STATUS } from '../constants';
import store from '../store';
import { processing, processed } from '@store/modules/processing';
import DefaultImage from '../images/default_image.png';
import { checkExpiry } from '../utils/utils';

const { width, height } = Dimensions.get('window');

const BOTTOM_HEIGHT_DIVIDER = height < 700 ? 7 : 9;

class Card extends Component {
  constructor(props) {
    console.log(`width ${width} && height: ${height}`)
    super(props);
    this.state = {
      pressedStyle: {},

      orgWidth: width - 32,
      orgHeight: height / 5,

      topBorderRadius: 5,
      bottomBorderRaidus: 0,

      pressed: false,

      offset: 0,

      shareModalVisible: false,
      email: '',

      top_width: new Animated.Value(width - 32),
      top_height: new Animated.Value(height / 5),
      bottom_width: new Animated.Value(width - 32),
      bottom_height: new Animated.Value(height / BOTTOM_HEIGHT_DIVIDER),
      content_height: new Animated.Value(0),

      top_pan: new Animated.ValueXY(),
      bottom_pan: new Animated.ValueXY(),
      content_pan: new Animated.ValueXY(),

      content_opac: new Animated.Value(0),
      button_opac: new Animated.Value(0),
      back_opac: new Animated.Value(0),
      plus: new Animated.Value(1),

      expired: false
    };
  }
  componentDidMount() {
    if (this.props.isAlert) {
      this.setState({ pressed: !this.state.pressed });
      this.calculateOffset();
    }
    const type = this.props.type;
    if (type !== CARD_TYPE.LIST) {
      this.checkExpiry();
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.item.status !== this.props.item.status) {
      console.log(this.props.item.status);
    }
  }

  checkExpiry = () => {
    const { expireAt } = this.props.item;
    if (expireAt && checkExpiry(expireAt)) {
      this.setState({ expired: true });
    }
  };

  onPress = () => {
    const type = this.props.type;

    if (this.props.onPress) this.props.onPress();

    if (type === CARD_TYPE.COUPON || type === CARD_TYPE.COUPON_TO) {
      this.setState({ pressed: !this.state.pressed });
      this.calculateOffset();
    }
  };

  grow = () => {
    this.setState({ topBorderRadius: 0, bottomBorderRadius: 5 });

    Animated.parallel([
      Animated.spring(this.state.top_width, {
        toValue: width
      }).start(),
      Animated.spring(this.state.top_height, {
        toValue: height / 2
      }).start(),
      Animated.spring(this.state.bottom_height, {
        toValue: height / BOTTOM_HEIGHT_DIVIDER + 50
      }).start(),
      Animated.spring(this.state.content_height, {
        toValue: height / 2
      }).start(),
      Animated.spring(this.state.top_pan, {
        toValue: {
          x: 0,
          y: -this.state.offset
        }
      }).start(),
      Animated.spring(this.state.content_pan, {
        toValue: {
          x: 0,
          y: -(height / 8 + this.state.offset)
        }
      }).start(),
      Animated.spring(this.state.bottom_pan, {
        toValue: {
          x: 0,
          y: -(50 + this.state.offset)
        }
      }).start(),

      Animated.timing(this.state.content_opac, {
        toValue: 1
      }).start(),
      Animated.timing(this.state.button_opac, {
        toValue: 1
      }).start(),
      Animated.timing(this.state.back_opac, {
        toValue: 1
      }).start(),
      Animated.timing(this.state.plus, {
        toValue: 0
      }).start()
    ]);
  };
  shrink = () => {
    this.setState({ TopBorderRadius: 5, BottomBorderRadius: 0 });
    if (this.props.onPressBack) this.props.onPressBack();
    Animated.parallel([
      Animated.spring(this.state.top_width, {
        toValue: this.state.orgWidth
      }).start(),
      Animated.spring(this.state.top_height, {
        toValue: this.state.orgHeight
      }).start(),
      Animated.spring(this.state.bottom_height, {
        toValue: height / BOTTOM_HEIGHT_DIVIDER
      }).start(),
      Animated.spring(this.state.top_pan, {
        toValue: {
          x: 0,
          y: 0
        }
      }).start(),
      Animated.spring(this.state.bottom_pan, {
        toValue: {
          x: 0,
          y: 0
        }
      }).start(),
      Animated.spring(this.state.content_height, {
        toValue: 0
      }).start(),
      Animated.timing(this.state.content_opac, {
        toValue: 0
      }).start(),
      Animated.timing(this.state.button_opac, {
        toValue: 0
      }).start(),
      Animated.timing(this.state.back_opac, {
        toValue: 0
      }).start(),
      Animated.timing(this.state.plus, {
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

  onPressShare = () => {
    this.setState({ shareModalVisible: true });
  };

  onCloseShareModal = () => {
    this.setState({ shareModalVisible: false, email: '' });
  };

  onPressSend = async () => {
    if (MyCouponService.getCurrentUserEmail() === this.state.email) {
      Alert.alert('My Coupons', "You can't send it to yourself");
      return;
    }
    try {
      const userExist = await MyCouponService.checkUser(this.state.email);
      if (userExist) {
        const userKey = Object.keys(userExist)[0];
        this.onCloseShareModal();
        store.dispatch(processing());
        MyCouponService.sendList(this.state.email, this.props.item, userKey)
          .then(() => Toast.showWithGravity('Successfully sent!', Toast.SHORT, Toast.BOTTOM))
          .catch(() => Alert.alert('My Coupons', 'Something went wrong. Please try again later'))
          .finally(() => store.dispatch(processed()));
      } else {
        Alert.alert('My Coupons', 'User does not exist!');
      }
    } catch (error) {
      Alert.alert('My Coupons', 'Something went wrong! Please try  again');
    }
  };

  onPressMainButton = () => {
    if (this.props.onPressMainButton) {
      this.props.onPressMainButton();
    }
  };

  renderTop = () => {
    const back = this.state.pressed
      ? <TouchableOpacity style={[styles.backButton, {}]} onPress={this.onPress}>
          <Animated.View style={{ opacity: this.state.back_opac }}>
            <Text style={{ color: 'white' }}>
              <Icon name="md-arrow-back" />
            </Text>
          </Animated.View>
        </TouchableOpacity>
      : <View />;

    const borderStyles = !this.state.pressed
    ? { borderTopRightRadius: this.state.topBorderRadius, borderTopLeftRadius: this.state.topBorderRadius }
      : { borderTopRightRadius:0, borderTopLeftRadius: 0 };

    const imageContent = this.props.item.image
      ? <Animated.Image
          source={{ uri: this.props.item.image }}
          style={[
            styles.top,
            borderStyles,
            {
              width: this.state.top_width,
              height: this.state.top_height,
              transform: this.state.top_pan.getTranslateTransform()
            }
          ]}
        />
      : <Animated.Image source={DefaultImage} style={{ width: '100%', height: '100%' }} />;
    const image = this.props.item.image ? { uri: this.props.item.image } : DefaultImage;
    return (
      <Animated.View
        style={[
          styles.top,
          borderStyles,
          {
            width: this.state.top_width,
            height: this.state.top_height,
            transform: this.state.top_pan.getTranslateTransform()
          }
        ]}
      >
        {/* {imageContent} */}
        <CachedImage source={image} style={{ width: '100%', height: '100%' }}>
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
        </CachedImage>
      </Animated.View>
    );
  };

  renderButtonLabel = () => {
    const { status } = this.props.item;
    const { type } = this.props;
    const { expired } = this.state;

    if (status === COUPON_STATUS.NOT_USED) {
      if (expired) return <Text style={styles.buttonText}>Expired</Text>;
      if (type === CARD_TYPE.COUPON_TO) return <Text style={styles.buttonText}>Not used</Text>;
      else return <Text style={styles.buttonText}>Request</Text>;
    }
    if (status === COUPON_STATUS.USED) 
      return <Text style={styles.buttonText}>Used</Text>

    if (type === CARD_TYPE.COUPON && status === COUPON_STATUS.REQUESTED) {
      return <ActivityIndicator animating={true} color="white" />;
    }

    if (type === CARD_TYPE.COUPON_TO && status === COUPON_STATUS.REQUESTED) {
      return <Text style={styles.buttonText}>Confirm</Text>;
    }
  };

  renderBottom = () => {
    /* var plusButton = !this.state.activated
        ?
    <Animated.View style={{opacity: this.state.plus, justifyContent: "center", alignItems: "center"}}>
        <Icon name="plus-circle" style={{fontSize: 24, color: this.props.color}}/>
    </Animated.View>
        :
        <Animated.View style={{opacity: this.state.plus, justifyContent: "center", alignItems: "center"}}>
        <Icon name="check-circle" style={{fontSize: 24, color: this.props.color}}/>
    </Animated.View> */
    const { expireOption, expireIn, expireAt, title, status } = this.props.item;
    const { sharable, type } = this.props;
    const { expired } = this.state;
    let disableButton = false;

    if (this.props.disableButton !== undefined) {
      disableButton = this.props.disableButton;
    } else if (status === COUPON_STATUS.USED || expired) {
      disableButton = true;
    }

    return (
      <Animated.View
        style={[
          styles.bottom,
          {
            width: this.state.bottom_width,
            height: this.state.bottom_height,
            borderRadius: this.bottomBorderRadius,
            transform: this.state.bottom_pan.getTranslateTransform()
          }
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{}}>
            <Text style={{ fontSize: 24, fontWeight: '700', paddingBottom: 8 }}>
              {title}
            </Text>
            {(type === CARD_TYPE.COUPON || type === CARD_TYPE.COUPON_TO) &&
              <Text style={{ fontSize: 12, fontWeight: '500', color: !expired ? 'gray' : 'red' }}>
                {expireOption === EXPIRE.IN && `Expires in ${expireIn.amount} ${expireIn.measure}`}
                {expireOption === EXPIRE.AT && `Expires at ${new Date(expireAt).toLocaleDateString()}`}
                {!expireOption && 'No expiry!!'}
              </Text>}
            {type === CARD_TYPE.LIST &&
              sharable &&
              <TouchableOpacity onPress={this.onPressShare}>
                <View style={{ flexDirection: 'row', alignItems: 'center', textDecorationLine: 'underline' }}>
                  <Text style={{ fontSize: 15, fontWeight: '500', color: '#00aaff' }}>Share with others</Text>
                  <Icon name="md-share-alt" style={{ fontSize: 20, marginLeft: 5, color: '#00aaff' }} />
                </View>
              </TouchableOpacity>}
            {(type === CARD_TYPE.LIST_FROM || type === CARD_TYPE.LIST_TO) &&
              <View>
                <Text style={{ fontSize: 15, fontWeight: '500', color: 'gray' }}>
                  {this.props.item.userName}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: '500', color: 'gray' }}>
                  {this.props.item.email}
                </Text>
              </View>}
          </View>

          {/* {plusButton} */}
        </View>
        {this.state.pressed &&
          <TouchableOpacity disabled={disableButton} onPress={this.onPressMainButton}>
            <Animated.View
              style={{
                opacity: this.state.button_opac,
                backgroundColor: !disableButton ? '#00aaff' : 'rgba(0,0,0,0.2)',
                marginTop: 10,
                borderRadius: 10,
                width: width - 64,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {this.renderButtonLabel()}
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
          opacity: this.state.content_opac,
          width: width,
          height: this.state.content_height,
          zIndex: -1,
          backgroundColor: 'rgb(242, 242, 242)',
          transform: this.state.content_pan.getTranslateTransform(),
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

  renderCardListBackground = () => {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: 'rgba(0,0,0,0.2)',
            top: -10,
            left: 10,
            right: -10,
            bottom: 10,
            position: 'absolute',
            borderBottomRightRadius: 5,
            zIndex: -1
          }
        ]}
      />
    );
  };

  renderActivateList = () => {
    const { type, item } = this.props;
    return type === CARD_TYPE.LIST_FROM && item.status === LIST_STATUS.PENDING
      ? <View style={[StyleSheet.absoluteFill, styles.coverCard, {}]}>
          <Text style={{ fontSize: 20, fontWeight: '600' }}>Touch to activate</Text>
        </View>
      : null;
  };

  render() {
    const { type } = this.props;
    return (
      <View style={[styles.container, this.state.pressedStyle]}>
        <TouchableWithoutFeedback onPress={!this.state.pressed ? this.onPress : null} style={{}}>
          <View ref="container" style={[{ alignItems: 'center' }]}>
            {this.props.item.used &&
              !this.state.pressed &&
              <View style={[StyleSheet.absoluteFill, styles.coverCard]} />}

            {this.renderTop()}
            {this.renderBottom()}
            {this.renderContent()}
            {type === CARD_TYPE.LIST || type === CARD_TYPE.LIST_FROM || type === CARD_TYPE.LIST_TO
              ? this.renderCardListBackground()
              : null}
          </View>
        </TouchableWithoutFeedback>
        <Modal
          visible={this.state.shareModalVisible}
          hasOpacityAnimation={true}
          touchToClose={true}
          onDismiss={this.onCloseShareModal}
        >
          <View style={{ marginHorizontal: 10, flexDirection: 'row', justifyContent: 'center' }}>
            <TextInput
              jaeautoCapitalize="none"
              style={{ flex: 0.8, backgroundColor: '#fff', paddingLeft: 10 }}
              width={100}
              placeholder="Email"
              autoFocus={true}
              autoCapitalize={'none'}
              keyboardType={'email-address'}
              onChangeText={text => this.setState({ email: text })}
            />
            <SubmitButton style={{ flex: 0.2 }} label="SEND" onPress={this.onPressSend} />
          </View>
        </Modal>
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
    backgroundColor: 'transparent',
    top: 32,
    left: 10
  },
  top: {
    marginBottom: 0,
    backgroundColor: 'gray'
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
  },
  coverCard: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    top: 0,
    left: 0,
    position: 'absolute',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 18
  }
});

Card.propTypes = {
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  onPress: PropTypes.func,
  onEditNumOfCoupons: PropTypes.func,
  onPressX: PropTypes.func,
  showXButton: PropTypes.bool,
  disableButton: PropTypes.bool,
  sharable: PropTypes.bool
};

export default Card;

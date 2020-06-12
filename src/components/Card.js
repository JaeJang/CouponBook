import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Animated,
  Dimensions,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
  BackHandler
} from 'react-native';
import { Icon, Input } from 'native-base';
import PropTypes from 'prop-types';
import _ from 'lodash';
import CachedImage from 'react-native-image-cache-wrapper';
import Toast from 'react-native-simple-toast';
import moment from 'moment';

import SubmitButton from './SubmitButton';
import Modal from './Modal';

import * as MyCouponService from '../services/MyCouponService';
import { CARD_TYPE, EXPIRE, LIST_STATUS, COUPON_STATUS } from '../constants';
import store from '../store';
import { processing, processed } from '@store/modules/processing';
import DefaultImage from '../images/default_image.png';
import { checkExpiry } from '../utils/utils';
import MinimizeButton from './MinimizeButton';

const { width, height } = Dimensions.get('window');

const BOTTOM_HEIGHT_DIVIDER = height < 700 ? 7 : height < 800 ? 8 : height < 900 ? 9 : 10;
const BOTTOM_PAN_ADDITION = height < 700 ? 90 : height < 800 ? 80 : height < 900 ? 60 : 50;
const CONTENT_PAN_ADDITION = height < 700 ? 5.5 : height < 800 ? 6.5 : height < 900 ? 7 : 8;
const DESCRIPTION_LENGTH_MAX_LIMIT = height < 700 ? 300 : 450;
const DESCRIPTION_LENGTH_LIMIT = height < 700 ? 180 : 300;
const NOTE_LENGTH_MAX_LIMIT = height < 700 ? 300 : 450;
const NOTE_LENGTH_LIMIT = height < 700 ? 80 : 200;

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

      offset: 0,

      shareModalVisible: false,
      email: '',

      container_width: new Animated.Value(width - 32),
      container_height: new Animated.Value(height / 5 + height / BOTTOM_HEIGHT_DIVIDER),

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

      expired: false,
      seeMore: false
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
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.state.pressed) {
        this.onPressBack();
        return true;
      }
    });
  }
  componentDidUpdate(prevProps) {
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  checkExpiry = () => {
    const { expireAt } = this.props.item;
    if (expireAt && checkExpiry(expireAt)) {
      this.setState({ expired: true });
    }
  };

  onPressCard = () => {
    const { type } = this.props;
    if (type === CARD_TYPE.COUPON || type === CARD_TYPE.COUPON_TO) {
      this.setState({ pressed: true }, () => {
        this.calculateOffset();
      });
    }
    if (this.props.onPress) this.props.onPress();
  };

  onPressBack = () => {
    if (this.props.onPressBack) this.props.onPressBack();
    this.setState({ pressed: false }, () => {
      this.calculateOffset();
    });
  };

  grow = () => {
    this.setState({ topBorderRadius: 0, bottomBorderRadius: 5 });
    Animated.parallel([
      Animated.spring(this.state.container_height, {
        toValue: height
      }).start(),
      Animated.spring(this.state.container_width, {
        toValue: width
      }).start(),
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
          y: -(height / CONTENT_PAN_ADDITION + this.state.offset)
        }
      }).start(),
      Animated.spring(this.state.bottom_pan, {
        toValue: {
          x: 0,
          y: -(BOTTOM_PAN_ADDITION + this.state.offset)
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
      }).start(),

      Animated.spring(this.state.container_height, {
        toValue: height / 5 + height / BOTTOM_HEIGHT_DIVIDER
      }).start(),
      Animated.spring(this.state.container_width, {
        toValue: this.state.orgWidth
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
          .catch(error => {
            if (error === 'empty') {
              Alert.alert('My Coupons', 'There is no available coupon in this list.');
            } else {
              Alert.alert('My Coupons', 'Something went wrong. Please try again later');
            }
          })
          .finally(() => store.dispatch(processed()));
      } else {
        Alert.alert('My Coupons', 'User does not exist!');
      }
    } catch (error) {
      Alert.alert('My Coupons', 'Something went wrong! Please try  again');
    }
  };

  onPressMainButton = () => {
    const { type, item } = this.props;
    if (
      this.props.onPressMainButton &&
      ((type === CARD_TYPE.COUPON && item.status === COUPON_STATUS.NOT_USED) ||
        (type === CARD_TYPE.COUPON_TO && item.status === COUPON_STATUS.REQUESTED))
    ) {
      this.props.onPressMainButton();
    }
  };

  renderTop = () => {
    const borderStyles = !this.state.pressed
      ? { borderTopRightRadius: this.state.topBorderRadius, borderTopLeftRadius: this.state.topBorderRadius }
      : { borderTopRightRadius: 0, borderTopLeftRadius: 0 };

    const image =
      this.props.item.image && !this.props.imageDownloadDisabled ? { uri: this.props.item.image } : DefaultImage;
      console.log(image);
    const elevation = this.state.pressed ? {} : { elevation: 5 };
    return (
      <Animated.View
        style={[
          styles.top,
          borderStyles,
          elevation,
          {
            width: this.state.top_width,
            height: this.state.top_height,
            transform: this.state.top_pan.getTranslateTransform()
          }
        ]}
      >
        <CachedImage source={image} style={[{ width: '100%', height: '100%' }]}>
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
              <Icon type="Ionicons" name="ios-close" style={[styles.xButtonIcon]} />
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
    if (status === COUPON_STATUS.USED) return <Text style={styles.buttonText}>Used</Text>;

    if (type === CARD_TYPE.COUPON && status === COUPON_STATUS.REQUESTED) {
      return <ActivityIndicator animating={true} color="white" />;
    }

    if (type === CARD_TYPE.COUPON_TO && status === COUPON_STATUS.REQUESTED) {
      return <Text style={styles.buttonText}>Confirm</Text>;
    }
  };

  renderDescription = () => {
    const { description, note } = this.props.item;
    let modifiedDes = description ? description : '',
      modifiedNote = note ? note : '';
    let seeMore = false;

    if (!modifiedNote.length && modifiedDes.length > DESCRIPTION_LENGTH_MAX_LIMIT) {
      modifiedDes = modifiedDes.substr(0, DESCRIPTION_LENGTH_MAX_LIMIT) + '.....';
      seeMore = true;
    } else if (modifiedDes.length > DESCRIPTION_LENGTH_LIMIT) {
      modifiedDes = modifiedDes.substr(0, DESCRIPTION_LENGTH_LIMIT) + '.....';
      if (modifiedNote.length > NOTE_LENGTH_LIMIT) {
        modifiedNote = modifiedNote.substr(0, NOTE_LENGTH_LIMIT) + '.....';
      }
      seeMore = true;
    } else if (modifiedDes.length <= DESCRIPTION_LENGTH_LIMIT && modifiedNote.length > NOTE_LENGTH_LIMIT) {
      modifiedNote = modifiedNote.substr(0, NOTE_LENGTH_LIMIT) + '.....';
      seeMore = true;
    } else if (!modifiedDes.length && modifiedNote.length > NOTE_LENGTH_MAX_LIMIT) {
      modifiedNote = modifiedNote.substr(0, NOTE_LENGTH_MAX_LIMIT) + '.....';
      seeMore = true;
    }

    return (
      <View style={{ backgroundColor: 'white', margin: 16, padding: 16, flex: 1 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: 'black' }}>Description</Text>

        <Text style={{ paddingTop: 5 }}>
          {modifiedDes}
        </Text>
        {modifiedNote
          ? <Text style={{ marginTop: 1, fontStyle: 'italic', padding: 5, color: 'gray' }}>
              Note: {modifiedNote}
            </Text>
          : null}
        {seeMore &&
          <Text style={{ color: '#00aaff' }} onPress={() => this.setState({ seeMore: true })}>
            {/* 안뇽 장재구리? 잘 자구 이로났니 사랑해 뿅뿅뿅 */}
            See More
          </Text>}
      </View>
    );
  };

  renderBottom = () => {
    const { expireOption, expireIn, expireAt, title, status, date } = this.props.item;
    const { sharable, type } = this.props;
    const { expired } = this.state;
    let disableButton = false;

    if (this.props.disableButton !== undefined) {
      disableButton = this.props.disableButton;
    } else if (status === COUPON_STATUS.USED || expired) {
      disableButton = true;
    }
    const elevation = this.state.pressed ? {} : { elevation: 5 };
    return (
      <Animated.View
        style={[
          styles.bottom,
          {
            width: this.state.bottom_width,
            height: this.state.bottom_height,
            borderRadius: this.bottomBorderRadius,
            transform: this.state.bottom_pan.getTranslateTransform()
          },
          elevation
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', paddingBottom: 5 }}>
                {title}
              </Text>
              {date &&
                <Text style={{ paddingBottom: 8, marginLeft: 5, fontSize: 12, color: 'gray' }}>
                  ({moment(date).format('MMM DD, YYYY')})
                </Text>}
            </View>
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
                <Text style={{ fontSize: 15, fontWeight: '400' }}>
                  {this.props.item.userName}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: '500', color: 'gray' }}>
                  {this.props.item.email}
                </Text>
              </View>}
          </View>
        </View>
        {this.state.pressed &&
          <TouchableOpacity disabled={disableButton} onPressIn={this.onPressMainButton}>
            <Animated.View
              ref={ref => (this.buttonRef = ref)}
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
        <View style={{ position: 'absolute', alignSelf: 'flex-end', top: 10, right: 10 }}>
          {this.props.item.status &&
            this.props.item.status === COUPON_STATUS.USED &&
            <Icon type="Ionicons" name="ios-checkmark-circle-outline" style={{ color: '#00B04F' }} />}
          {this.props.item.status &&
            this.props.item.status === COUPON_STATUS.NOT_USED &&
            this.state.expired &&
            <Icon
              type="MaterialCommunityIcons"
              name="alert-circle-outline"
              style={[{ color: 'red', fontSize: 25 }]}
            />}
          {!this.state.pressed &&
            this.props.item.status &&
            this.props.item.status === COUPON_STATUS.REQUESTED &&
            <ActivityIndicator animating={true} />}
        </View>
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
        {this.renderDescription()}
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
    const { type, pressed, item } = this.props;
    const { expired } = this.state;

    return (
      <Animated.View
        pointerEvents={pressed === true && !this.state.pressed ? 'none' : 'auto'}
        style={[
          styles.container,
          this.state.pressedStyle,

          { width: this.state.container_width, height: this.state.container_height }
        ]}
      >
        <TouchableWithoutFeedback onPress={!this.state.pressed ? this.onPressCard : null} style={{}}>
          <View ref="container" style={[{ alignItems: 'center' }]}>
            {/* {expired &&
              item.status === COUPON_STATUS.NOT_USED &&
              !this.state.pressed &&
              <View style={[StyleSheet.absoluteFill, styles.coverCard]} />} */}
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
          <View
            style={{
              marginHorizontal: 10,
              justifyContent: 'center',
              height: 150,
              padding: 20,
              backgroundColor: 'white'
            }}
          >
            <Input
              style={{
                flex: 1,
                backgroundColor: '#fff',
                marginBottom: 10,
                borderRadius: 5,
                borderBottomWidth: 0.5,
                paddingBottom: 5,
                borderBottomColor: 'rgba(0,0,0,0.3)'
              }}
              placeholder="Email"
              autoFocus={true}
              autoCapitalize={'none'}
              keyboardType={'email-address'}
              onChangeText={text => this.setState({ email: text })}
              placeholderTextColor="rgba(0,0,0,0.3)"
            />
            <SubmitButton style={{ flex: 1 }} label="SEND" onPress={this.onPressSend} />
          </View>
        </Modal>
        <Modal
          visible={this.state.seeMore}
          hasOpacityAnimation={true}
          onDismiss={() => this.setState({ seeMore: false })}
        >
          <ScrollView style={{ backgroundColor: 'white', margin: 16, padding: 16, flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: 'black' }}>Description</Text>

            <Text style={{ paddingTop: 10 }}>
              {this.props.item.description}
            </Text>
            {this.props.item.note
              ? <Text style={{ marginTop: 5, fontStyle: 'italic', padding: 5, color: 'gray' }}>
                  Note: {this.props.item.note}
                </Text>
              : null}
          </ScrollView>
          <SubmitButton style={{}} label="Close" onPress={() => this.setState({ seeMore: false })} />
        </Modal>
        {this.state.pressed && <MinimizeButton visible={true} onPressBack={this.onPressBack} />}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#0000'
  },
  backButton: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 32,
    left: 10,
    zIndex: 10
  },
  backButtonLeft: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 10,
    bottom: 0,
    alignItems: 'flex-end'
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
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 50,
    alignSelf: 'flex-start',
    width: 30,
    height: 30,
    justifyContent: 'center',
    top: 5,
    left: 5
  },
  number: {
    textAlignVertical: 'center',
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    borderColor: '#000'
  },
  xButtonContainer: {
    position: 'absolute',
    //backgroundColor: 'rgba(175,175,175,0.5)',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 50,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    top: 5,
    right: 5,
    zIndex: 15
  },
  xButtonIcon: {
    fontWeight: '800',
    textAlign: 'center',
    color: '#fff',
    fontSize: 30,
    width: 30,
    height: 30,
    borderColor: '#000',
    zIndex: 15
  },
  checkedContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(175,175,175,0.8)',
    borderRadius: 50,
    justifyContent: 'center',
    alignSelf: 'flex-start'
  },
  checkedIcon: {
    color: '#00B04F',
    marginLeft: 10,
    marginTop: 10,
    fontSize: 35,
    position: 'absolute',
    alignSelf: 'flex-end'
  },
  coverCard: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    top: 0,
    left: 0,
    position: 'absolute',
    zIndex: 5,
    elevation: 5,
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

const mapStateToProps = state => {
  return {
    imageDownloadDisabled: state.profile.imageDownloadDisabled
  };
};

export default connect(mapStateToProps, null)(Card);

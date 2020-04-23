import React, { Component } from 'react';
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import { Input, Button, Content, Container, Icon } from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import DefaultImage from '../../images/default_image.png';
import CheckBox from 'react-native-check-box';
import { Dropdown } from 'react-native-material-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-simple-toast';
import PropTypes from 'prop-types';

import DateTimePickerModal from '@components/DateTimePicker';
import SubmitButton from '@components/SubmitButton';

import { EXPIRE } from '@constants';

import * as MyCouponService from '@service/MyCouponService';
import { timingAnimation } from '@utils/animation';
import firebase from '../../configs/firebase';

import NewCoupon from '../../models/NewCoupon';

import store from '../../store';
import { processing, processed } from '@store/modules/processing';
import { refreshMyCoupons } from '@modules/mycoupons';

const deviceWidth = Dimensions.get('window').width;
const inputRange = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
const outputRange = [0, -10, 10, -10, 10, -10, 10, -10, 10, -10, 0];
const expireInData = [
  {
    value: 'year',
    label: 'Year'
  },
  {
    value: 'month',
    label: 'Month'
  },
  {
    value: 'day',
    label: 'Day'
  }
];

const Field = ({ label, ...props }) => {
  return (
    <View style={[styles.field]}>
      <Text style={styles.fieldLabel}>
        {label}
      </Text>
      {props.children}
    </View>
  );
};

class NewCouponScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        image: '',
        expireOption: '',
        description: '',
        note: '',
        expireIn: { measure: '', amount: '' },
        expireAt: '',
        title: ''
      },
      isDatePickerVisible: false,
      nameError: false,
      expiryError: false,
      status: props.navigation.getParam('status')
    };

    this.nameEmptyError = new Animated.Value(0);
    this.expireError = new Animated.Value(0);
  }

  componentDidMount() {
    if (this.state.status === 'UPDATE') {
      const data = this.props.navigation.getParam('coupon', null);
      this.setState({ data: data });
    } else {
      const user = firebase.getUser();
      if (user.photoURL) {
        this.setState({ data: { ...this.state.data, image: user.photoURL } });
      }
    }
  }

  openImagePicker = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,

      cropping: true,
      compressImageQuality: 0.3
    }).then(image => {
      this.setState({ data: { ...this.state.data, image: image.path } });
    });
  };

  setToDefaultImage = () => {
    this.setState({ data: { ...this.state.data, image: '' } });
  };

  onClickExpireIn = async () => {
    if (this.state.data.expireOption === EXPIRE.IN) {
      this.setState({ data: { ...this.state.data, expireOption: '' } });
    } else {
      this.setState({ data: { ...this.state.data, expireOption: EXPIRE.IN } });
    }
  };

  onClickExpireAt = () => {
    if (this.state.data.expireOption === EXPIRE.AT) {
      this.setState({ data: { ...this.state.data, expireOption: '' } });
    } else {
      this.setState({ data: { ...this.state.data, expireOption: EXPIRE.AT } });
    }
  };

  checkExpiry = () => {
    const { data } = this.state;
    if (data.expireOption === EXPIRE.IN) {
      if (!data.expireIn.measure && !data.expireIn.amount) {
        return false;
      }
    } else if (data.expireOption === EXPIRE.AT && !data.expireAt) {
      return false;
    }
    return true;
  };

  validateBasicInfo = () => {
    const { title } = this.state.data;
    let valid = true;
    if (!title) {
      this.setState({ nameError: true });
      this.nameEmptyError.setValue(0);
      timingAnimation(this.nameEmptyError, 1, 800);
      valid = false;
    } else {
      this.setState({ nameError: false });
    }
    if (!this.checkExpiry()) {
      this.setState({ expiryError: true });
      this.expireError.setValue(0);
      timingAnimation(this.expireError, 1, 800);
      valid = false;
    } else {
      this.setState({ expiryError: false });
    }
    return valid;
  };

  handleConfirm = date => {
    this.setState({ data: { ...this.state.data, expireAt: date.getTime() } });
    this.hideDatePicker();
  };
  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };

  handleSave = async () => {
    const { data, status } = this.state;

    if (!this.validateBasicInfo()) {
      return;
    }
    store.dispatch(processing());
    const newCoupon = new NewCoupon(data);

    if (data.image) {
      try {
        const imageData = await MyCouponService.uploadPhoto(data.image);
        newCoupon.setImage(imageData);
      } catch (error) {
        Alert.alert('New Coupon', 'Something went wrong. Please try again');
        store.dispatch(processed());
      }
    }
    MyCouponService.createNewCoupon(newCoupon)
      .then(result => {
        Toast.showWithGravity('Successfully Uploaded!', Toast.SHORT, Toast.BOTTOM);
        if (status === 'LIST') {
          this.props.refreshMyCoupons();
          this.props.navigation.navigate('Add Coupon List', { newCoupon: result });
        } else if (status === 'COUPON') {
          this.props.refreshMyCoupons();
          this.props.navigation.navigate('Coupons');
        }
      })
      .catch(error => {
        Alert.alert('New Coupon', 'Something went wrong. Please try again');
      })
      .finally(() => store.dispatch(processed()));
  };

  render() {
    const { data, isDatePickerVisible } = this.state;
    const nameFontSize = this.nameEmptyError.interpolate({
      inputRange: inputRange,
      outputRange: outputRange
    });
    const expireShake = this.expireError.interpolate({
      inputRange: inputRange,
      outputRange: outputRange
    });
    const nameBorderStyle = this.state.nameError ? { borderBottomColor: 'red' } : { borderBottomColor: 'gray' };
    const expiryBorderStyle = this.state.expiryError
      ? { borderColor: 'red', borderWidth: 1, borderBottomColor: 'red', borderBottomWidth: 1, borderRadius: 5 }
      : {};
    return (
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView>
          <Animated.View style={[{ left: nameFontSize }, nameBorderStyle, styles.newtitle]}>
            <Text style={{ color: 'gray' }}>New Coupon Name*</Text>
            <TextInput
              autoFocus={true}
              placeholder="Please enter"
              maxLength={30}
              style={[styles.titleInput, nameBorderStyle]}
              onChangeText={text => this.setState({ data: { ...this.state.data, title: text } })}
              value={this.state.data.title}
            />
            <View style={{ borderBottomWidth: 2, borderBottomColor: 'red', marginBottom: 10 }} />
          </Animated.View>
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity onPress={this.openImagePicker}>
              {!data.image
                ? <Image source={DefaultImage} style={{ height: 130, width: deviceWidth }} resizeMode="cover" />
                : <Image source={{ uri: data.image }} style={{ height: 230 }} resizeMode="cover" />}
              {data.image !== '' &&
                <TouchableOpacity style={[styles.setToDefaultImageTouchable]} onPress={this.setToDefaultImage}>
                  <Icon name="close" style={[styles.setToDefaultImageIcon]} />
                </TouchableOpacity>}
            </TouchableOpacity>
            <Text style={styles.imageClickText}>Touch image above if you want to use your own image</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <View style={{ paddingBottom: 10 }}>
              <Animated.View style={[styles.field, expiryBorderStyle, { left: expireShake }]}>
                <Text style={styles.fieldLabel}>Expiry</Text>
                <Animated.View style={[styles.expireSelectionView]}>
                  <View style={[styles.expireSelection]}>
                    <Text>Expires </Text>
                    <Text style={{ fontWeight: '700' }}>IN</Text>
                    <CheckBox
                      checkBoxColor={'#00aaff'}
                      isChecked={data.expireOption === EXPIRE.IN}
                      onClick={this.onClickExpireIn}
                    />
                  </View>
                  <View style={[styles.expireSelection, { marginLeft: 30 }]}>
                    <Text>Expires </Text>
                    <Text style={{ fontWeight: '700' }}>AT</Text>
                    <CheckBox
                      checkBoxColor={'#00aaff'}
                      isChecked={data.expireOption === EXPIRE.AT}
                      onClick={this.onClickExpireAt}
                    />
                  </View>
                </Animated.View>
                <Animated.View style={[{ paddingHorizontal: 20 }]}>
                  {data.expireOption === EXPIRE.IN &&
                    <Animated.View style={[styles.expirePicker]}>
                      <Dropdown
                        containerStyle={{ flex: 1 }}
                        label="Select"
                        data={expireInData}
                        value={this.state.data.expireIn.measure}
                        onChangeText={text =>
                          this.setState({
                            data: { ...this.state.data, expireIn: { ...this.state.data.expireIn, measure: text } }
                          })}
                      />
                      <Input
                        style={[styles.expireInTextInput]}
                        keyboardType={'number-pad'}
                        returnKeyType={'done'}
                        value={data.expireIn.amount}
                        onChangeText={text =>
                          this.setState({
                            data: { ...this.state.data, expireIn: { ...this.state.data.expireIn, amount: text } }
                          })}
                      />
                    </Animated.View>}
                  {data.expireOption === EXPIRE.AT &&
                    <View style={[styles.expirePicker]}>
                      <Button style={[styles.selectDate]} onPress={() => this.setState({ isDatePickerVisible: true })}>
                        <Text style={{ color: '#00aaff' }}>Select Expriy date</Text>
                      </Button>
                      <Text style={{ flex: 1, marginLeft: 10, textAlign: 'center' }}>
                        {data.expireAt ? new Date(data.expireAt).toDateString() : '-'}
                      </Text>
                      <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={this.handleConfirm}
                        onCancel={this.hideDatePicker}
                      />
                    </View>}
                </Animated.View>
              </Animated.View>
              <Field label="Description">
                <TextInput
                  multiline={true}
                  numberOfLines={10}
                  style={[styles.descriptionTextInput]}
                  onChangeText={text => {
                    this.setState({ data: { ...this.state.data, description: text } });
                  }}
                  value={this.state.data.description}
                />
              </Field>
              <Field label="Note">
                <TextInput
                  multiline={true}
                  numberOfLines={10}
                  style={[styles.noteTextInput]}
                  onChangeText={text => {
                    this.setState({ data: { ...this.state.data, note: text } });
                  }}
                  value={this.state.data.note}
                  returnKeyType="done"
                />
              </Field>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <SubmitButton onPress={this.handleSave} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  newtitle: {
    alignItems: 'center',
    borderBottomWidth: 1,
    marginHorizontal: 10,
    marginTop: 15
  },
  titleInput: {
    paddingTop: 10,
    fontSize: 20,
    textAlign: 'center',
    width: '95%',
    paddingHorizontal: 10
    //marginTop: 15,
    //borderWidth: 1,
    //borderColor: 'gray',
    //paddingVertical: 5,
    //borderRadius: 10,
  },
  imageClickText: {
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
    color: 'gray',
    marginTop: 5
  },
  expireSelectionView: {
    justifyContent: 'center',
    flexDirection: 'row'
  },
  expireSelection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  expirePicker: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    marginTop: 10
  },
  field: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
    //borderRadius: 10,
    marginHorizontal: 10,
    paddingHorizontal: 5,
    paddingTop: 5,
    paddingBottom: 15,
    marginTop: 15
  },
  fieldLabel: {
    color: 'rgba(0,0,0,0.6)'
  },
  descriptionTextInput: {
    paddingHorizontal: 10,
    marginTop: 10,

    borderRadius: 5,
    fontSize: 20
  },
  noteTextInput: {
    paddingHorizontal: 10,
    marginTop: 10,

    borderRadius: 5,
    fontSize: 15,
    fontStyle: 'italic',
    fontWeight: '300'
  },
  expireInTextInput: {
    flex: 1,
    borderWidth: 0.6,
    borderRadius: 5,
    marginLeft: 10
  },
  selectDate: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center'
  },
  setToDefaultImageIcon: {
    fontWeight: '800',
    textAlign: 'center',
    color: '#fff',
    fontSize: 35,
    width: 35,
    height: 35,
    borderColor: '#000'
  },
  setToDefaultImageTouchable: {
    position: 'absolute',
    backgroundColor: 'rgba(175,175,175,0.8)',
    borderRadius: 50,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    top: 5,
    right: 5
  }
});

NewCouponScreen.propTypes = {
  refreshMyCoupons: PropTypes.func.isRequired
};

export default connect(null, { refreshMyCoupons })(NewCouponScreen);

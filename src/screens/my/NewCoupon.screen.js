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
  ScrollView
} from 'react-native';
import { Input, Button } from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import DefaultImage from '../../images/default_image.png';
import CheckBox from 'react-native-check-box';
import { Dropdown } from 'react-native-material-dropdown';
import DateTimePickerModal from '@components/DateTimePicker';

import { EXPIRE } from '@constants';
import { uriToBlob } from '@utils/uploadImage';
import { timingAnimation } from '@utils/animation';
import { sleep } from '@utils/sleep';

const deviceWidth = Dimensions.get('window').width;

const expireInData = [
  {
    value: 'Year'
  },
  {
    value: 'Month'
  },
  {
    value: 'Day'
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
      image: '',
      expireOption: '',
      isDatePickerVisible: false,
      description: '',
      note: '',
      expireIn: {measure: '', amount: ''},
      expireAt: ''
    };
  }

  componentDidMount() {}

  openImagePicker = () => {
    ImagePicker.openPicker({
      width: 400,
      includeBase64: true,
      cropping: true,
      compressImageQuality: 0.8
    }).then(image => {
      this.setState({ image: image.path });
    });
  };

  onClickExpireIn = async () => {
    if (this.state.expireOption === EXPIRE.IN) {
      this.setState({ expireOption: '' });
    } else {
      this.setState({ expireOption: EXPIRE.IN });
    }
  };

  onClickExpireAt = () => {
    if (this.state.expireOption === EXPIRE.AT) {
      this.setState({ expireOption: '' });
    } else {
      this.setState({ expireOption: EXPIRE.AT });
    }
  };

  handleConfirm = date => {
    console.log(date);
    this.setState({expireAt: date});
    this.hideDatePicker();
  };
  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };

  render() {
    const { image, expireOption, isDatePickerVisible, expireAt } = this.state;

    return (
      <ScrollView>
        <View style={{ alignItems: 'center' }}>
          <TextInput placeholder="New Coupon Name" style={{ fontSize: 30, borderBottomWidth: 2, marginTop: 15 }} />
        </View>
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity onPress={this.openImagePicker}>
            {!image
              ? <Image source={DefaultImage} style={{ height: 130, width: deviceWidth }} resizeMode="cover" />
              : <Image source={{ uri: image }} style={{ height: 130, width: deviceWidth }} resizeMode="stretch" />}
          </TouchableOpacity>
          <Text style={styles.imageClickText}>Touch image above if you want to use your own image</Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <View style={{ paddingBottom: 10 }}>
            <Field label="Expiry (optional)">
              <View style={[styles.expireSelectionView]}>
                <View style={[styles.expireSelection]}>
                  <Text>Expires </Text>
                  <Text style={{ fontWeight: '700' }}>IN</Text>
                  <CheckBox
                    checkBoxColor={'#00aaff'}
                    isChecked={expireOption === EXPIRE.IN}
                    onClick={this.onClickExpireIn}
                  />
                </View>
                <View style={[styles.expireSelection, { marginLeft: 30 }]}>
                  <Text>Expires </Text>
                  <Text style={{ fontWeight: '700' }}>AT</Text>
                  <CheckBox
                    checkBoxColor={'#00aaff'}
                    isChecked={expireOption === EXPIRE.AT}
                    onClick={this.onClickExpireAt}
                  />
                </View>
              </View>
              <Animated.View style={[{ paddingHorizontal: 20 }]}>
                {expireOption === EXPIRE.IN &&
                  <Animated.View style={[styles.expirePicker]}>
                    <Dropdown containerStyle={{ flex: 1 }} label="Select" data={expireInData} />
                    <Input style={[styles.expireInTextInput]} keyboardType={'number-pad'} returnKeyType={'done'} />
                  </Animated.View>}
                {expireOption === EXPIRE.AT &&
                  <View style={[styles.expirePicker]}>
                    <Button style={[styles.selectDate]} onPress={() => this.setState({ isDatePickerVisible: true })}>
                      <Text style={{ color: '#00aaff' }}>Select Expriy date</Text>
                    </Button>
                    <Text style={{ flex: 1, marginLeft: 10, textAlign: 'center' }}>{expireAt ? expireAt.toDateString() : '-'}</Text>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={this.handleConfirm}
                      onCancel={this.hideDatePicker}
                    />
                  </View>}
              </Animated.View>
            </Field>
            <Field label="Description *">
              <TextInput
                multiline={true}
                numberOfLines={10}
                style={[styles.descriptionTextInput]}
                onChangeText={text => {
                  this.setState({ description: text });
                }}
                value={this.state.description}
              />
            </Field>
            <Field label="Note (optional)">
              <TextInput
                multiline={true}
                numberOfLines={10}
                style={[styles.noteTextInput]}
                onChangeText={text => {
                  this.setState({ note: text });
                }}
                value={this.state.note}
              />
            </Field>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
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
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 10,
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
    backgroundColor: 'white',
    borderRadius: 5,
    fontSize: 20
  },
  noteTextInput: {
    paddingHorizontal: 10,
    marginTop: 10,
    backgroundColor: 'white',
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
  }
});

export default NewCouponScreen;

import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, Alert, FlatList, ScrollView } from 'react-native';
import { Fab, Icon, Button } from 'native-base';
import { connect } from 'react-redux';

import CouponList from '@components/CouponList';
import Modal from '@components/Modal';
import SubmitButton from '@components/SubmitButton';
import NumOfCouponsModal from '@components/NumOfCouponsModal';
import TwoButtonModal from '@components/TwoButtonModal';
import Card from '@components/Card';

import { CARD_TYPE } from '@constants';

import { timingAnimation } from '@utils/animation';

import * as MyCouponService from '@service/MyCouponService';

import NewCouponList from '../../models/NewCouponList';

import store from '../../store';
import { processing, processed } from '@store/modules/processing';
import { addCouponList } from '@modules/mycoupons';

const inputRange = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
const outputRange = [0, -10, 10, -10, 10, -10, 10, -10, 10, -10, 0];

class AddMyCouponList extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerShown: navigation.getParam('headerShown', true)
  });
  constructor(props) {
    super(props);
    this.state = {
      couponListName: '',
      nameError: false,
      addCouponOptionModal: false,
      couponList: [],
      editNumOfCouponsModal: false,
      editNumOfCouponsIndex: null,
      scroll: true
    };

    this.nameEmptyError = new Animated.Value(0);
  }

  componentDidUpdate(prevProps) {
    const newCoupon = this.props.navigation.getParam('newCoupon', null);
    if (prevProps.navigation.state !== this.props.navigation.state && newCoupon) {
      const list = this.state.couponList;
      list.push(newCoupon);
      this.setState({ couponList: list });
      this.props.navigation.setParams({ newCoupon: null });
    }
  }

  goToNewCoupon = () => {
    this.props.navigation.navigate('New Coupon', { status: 'LIST' });
    this.setState({ addCouponOptionModal: false });
  };

  goToImportCoupon = () => {
    this.props.navigation.navigate('Import Coupon');
    this.setState({ addCouponOptionModal: false });
  }

  goToUpdateCoupon = index => {
    const { couponList } = this.state;
    this.props.navigation.navigate('Update Coupon', { status: 'UPDATE', index: index, coupon: couponList[index] });
    this.setState({ addCouponOptionModal: false });
  };

  onDeleteCouponFromList = index => {
    const list = this.state.couponList;
    list.splice(index, 1);
    this.setState({ couponList: list });
  };

  onEditNumOfCoupons = index => {
    this.setState({ editNumOfCouponsModal: true, editNumOfCouponsIndex: index });
  };

  onNumOfCouponLeft = index => {
    const { couponList } = this.state;
    const coupon = couponList[index];
    if (coupon.numOfCoupons > 1) {
      coupon.numOfCoupons -= 1;
      this.setState({ couponList: couponList });
    }
  };
  onNumOfCouponRight = index => {
    const { couponList } = this.state;
    const coupon = couponList[index];
    coupon.numOfCoupons += 1;
    this.setState({ couponList: couponList });
  };

  onPressCard = () => {
    this.props.navigation.setParams({ headerShown: false });
    this.setState({ scroll: false });
  };
  onPressCardBack = () => {
    this.props.navigation.setParams({ headerShown: true });
    this.setState({ scroll: true });
  };

  handleSave = async () => {
    const { couponList, couponListName } = this.state;
    if (couponList.length === 0) return;
    if (!couponListName) {
      this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
      this.nameEmptyError.setValue(0);
      timingAnimation(this.nameEmptyError, 1, 800);
      this.setState({ nameError: true });
      return;
    } else {
      this.setState({ nameError: false });
    }
    store.dispatch(processing());
    const newCouponlist = new NewCouponList(couponList, couponListName);
    MyCouponService.createNewCouponList(newCouponlist.getRequestData())
      .then(() => {
        this.props.addCouponList(newCouponlist.getRequestData());
        this.props.navigation.navigate('Coupon Lists');
      })
      .catch(error => {
        console.error(error);
        Alert.alert('New Coupon List', 'Something went wrong! Please try again');
      })
      .finally(() => store.dispatch(processed()));
  };

  render() {
    const { addCouponOptionModal, couponList, editNumOfCouponsModal, editNumOfCouponsIndex } = this.state;
    const nameShake = this.nameEmptyError.interpolate({
      inputRange: inputRange,
      outputRange: outputRange
    });
    const nameBorderStyle = this.state.nameError ? { borderBottomColor: 'red' } : { borderBottomColor: 'gray' };
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <FlatList
              ref={ref => {
                this.flatListRef = ref;
              }}
              scrollEnabled={this.state.scroll}
              ListHeaderComponent={
                <Animated.View style={[styles.couponListNameContainer, nameBorderStyle, { left: nameShake }]}>
                  <Text style={{ color: 'gray' }}>New Coupon List Name*</Text>
                  <TextInput
                    style={[styles.couponListName]}
                    value={this.state.couponListName}
                    onChangeText={text => this.setState({ couponListName: text })}
                    placeholder="Please Enter"
                  />
                </Animated.View>
              }
              data={couponList}
              showsHorizontalScrollIndicator={false}
              horizontal={false}
              keyExtractor={item => item.key}
              renderItem={({ item, index }) =>
                <Card
                  type={CARD_TYPE.COUPON}
                  item={item}
                  onPress={this.onPressCard}
                  onPressBack={this.onPressCardBack}
                  showXButton={true}
                  onEditNumOfCoupons={() => this.onEditNumOfCoupons(index)}
                  onPressX={() => this.onDeleteCouponFromList(index)}
                />}
            />
            {/* <CouponList
              list={couponList}
              onDelete={this.onDeleteCouponFromList}
              onEditNumOfCoupons={this.onEditNumOfCoupons}
            /> */}

            {/* <Card
                  type={CARD_TYPE.COUPON}
                  item={{numOfCoupons:1}}
                  onPress={this.onPressCard}
                  onPressBack={this.onPressCardBack}
                  showXButton={true}
                />
                <Card
                  type={CARD_TYPE.COUPON}
                  item={{numOfCoupons:1}}
                  onPress={this.onPressCard}
                  onPressBack={this.onPressCardBack}
                  showXButton={true}
                />
                <Card
                  type={CARD_TYPE.COUPON}
                  item={{numOfCoupons:1}}
                  onPress={this.onPressCard}
                  onPressBack={this.onPressCardBack}
                  showXButton={true}
                /> */}

            <Fab
              active={false}
              direction="up"
              containerStyle={{}}
              style={{ backgroundColor: '#00aaff' }}
              position="bottomRight"
              onPress={() => this.setState({ addCouponOptionModal: true })}
            >
              <Icon name="md-add" />
            </Fab>
          </View>
          <View style={{}}>
            <SubmitButton onPress={this.handleSave} />
          </View>
        </View>
        <TwoButtonModal
          visible={addCouponOptionModal}
          onDismiss={() => this.setState({ addCouponOptionModal: false })}
          onPressRight={this.goToNewCoupon}
          onPressLeft={this.goToImportCoupon}
          left={{icon: 'md-search', label: 'Import'}}
          right={{icon: 'md-add', label: 'Create New'}}
        />
        {editNumOfCouponsModal &&
          <NumOfCouponsModal
            visible={editNumOfCouponsModal}
            onDismiss={() => this.setState({ editNumOfCouponsModal: false, editNumOfCouponsIndex: null })}
            list={couponList}
            index={editNumOfCouponsIndex}
            onLeftClick={this.onNumOfCouponLeft}
            onRightClick={this.onNumOfCouponRight}
          />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: '#00aaff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  couponListNameContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginHorizontal: 10,
    marginTop: 15,
    flex: 0.1,
    alignItems: 'center'
  },
  couponListName: {
    /* fontSize: 30,
    marginTop: 15,
    width: '95%',
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    textAlign: 'center' */
    paddingTop: 10,
    fontSize: 20,
    textAlign: 'center',
    width: '95%',
    paddingHorizontal: 10
  }
});

export default connect(null, { addCouponList })(AddMyCouponList);

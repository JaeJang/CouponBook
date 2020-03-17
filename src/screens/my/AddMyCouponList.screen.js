import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Fab, Icon, Button } from 'native-base';
import CouponList from '@components/CouponList';
import Modal from '@components/Modal';
const data = [
  {
    id: '0',
    couponName: 'Test Coupon',
    company: 'Test Company',
    email: 'test@test.com',
    firstName: 'Jae',
    lastName: 'Jang',
    created: '20.03.07',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/coupon-book-4811d.appspot.com/o/public%2Fimages%2FIMG_2801.JPG?alt=media&token=8a2d129c-9b65-407f-a621-16b606498905'
  },
  {
    id: '1',
    couponName: 'Test Coupon',
    company: 'Test Company',
    email: 'test@test.com',
    firstName: 'Jae',
    lastName: 'Jang',
    created: '20.03.07',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/coupon-book-4811d.appspot.com/o/public%2Fimages%2F32974782_1862720354025792_5250303395704602624_o.jpg?alt=media&token=22e9f755-9c92-4071-a7fc-c73da75869de'
  }
];
class AddMyCouponList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addCouponOptionModal: false
    };
  }

  goToNewCoupon = () => {
    this.props.navigation.navigate('New Coupon');
    this.setState({ addCouponOptionModal: false });
  };

  render() {
    const { addCouponOptionModal } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 0.1, alignItems: 'center' }}>
            <TextInput style={{ fontSize: 30, borderBottomWidth: 2, marginTop: 15 }} placeholder="Coupon List Name" />
          </View>
          <View style={{ flex: 0.8 }}>
            <CouponList list={data} />

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
          <View style={{ flex: 0.1 }}>
            <Button style={styles.saveButton}>
              <Text style={[styles.white]}>Save</Text>
            </Button>
          </View>
        </View>
        <Modal
          visible={addCouponOptionModal}
          onDismiss={() => this.setState({ addCouponOptionModal: false })}
          hasOpacityAnimation={true}
          hasTransformYAnimation={true}
          touchToClose={true}
        >
          <View style={{ justifyContent: 'space-around', flexDirection: 'row' }}>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity style={styles.customFab}>
                <Icon name="md-search" style={[styles.white]} />
              </TouchableOpacity>
              <Text style={styles.customFabText}>Import</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity style={styles.customFab} onPress={this.goToNewCoupon}>
                <Icon name="md-add" style={[styles.white]} />
              </TouchableOpacity>
              <Text style={styles.customFabText}>New</Text>
            </View>
          </View>
        </Modal>
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
  customFab: {
    backgroundColor: '#00aaff',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowRadius: 2,
    shadowOffset: { widht: 1, height: 1 },
    shadowOpacity: 0.4
  },
  customFabText: {
    color: '#fff',
    fontWeight: '500'
  },
  white: {
    color: '#fff'
  }
});
export default AddMyCouponList;

import React, { Component } from 'react';
import { FlatList, Image, View, Text } from 'react-native';
import {Icon, Fab} from 'native-base';
import firebase from 'firebase';

import CouponList from '@components/CouponList';
import { ScrollView } from 'react-native-gesture-handler';
class FromScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.setState({
      data: [
        {
          id: '0',
          title: 'Test Coupon',
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
          title: 'Test Coupon',
          company: 'Test Company',
          email: 'test@test.com',
          firstName: 'Jae',
          lastName: 'Jang',
          created: '20.03.07',
          imageUrl:
            'https://firebasestorage.googleapis.com/v0/b/coupon-book-4811d.appspot.com/o/public%2Fimages%2F32974782_1862720354025792_5250303395704602624_o.jpg?alt=media&token=22e9f755-9c92-4071-a7fc-c73da75869de'
        }
      ]
    });
  }

  render() {
    return (
      <View style={{flex:1}}>
        {/* <CouponList list={this.state.data} /> */}
        <Fab
            active={false}
            direction="up"
            containerStyle={{}}
            style={{ backgroundColor: '#ff6d1a' }}
            position="bottomRight"
          >
            <Icon name="md-add" />
          </Fab>
      </View>
    );
  }
}

export default FromScreen;

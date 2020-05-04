import React, { Component } from 'react';
import { FlatList, Image, View, Text, Alert } from 'react-native';
import { connect } from 'react-redux';

import Card from '@components/Card';
import { CARD_TYPE, LIST_STATUS } from '@constants';
import { getFromList, getFromListAfter } from '@modules/from';

import * as FromService from '@service/FromService';
class FromScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    if (!this.props.fromList.length) {
      this.props.getFromList();
    }
  }

  onPressList = item => {
    this.props.navigation.navigate('From Detail', { item: item, title: item.title });
  };

  onPressX = (item, index) => {};

  renderFooter = () => {
    /* const { couponKeys, couponLastKey } = this.props;
    const index = couponKeys.indexOf(couponLastKey);
    if (index + 1 < couponKeys.length) {
      return (
        <View style={{ flex: 1 }}>
          <Button label="Load More" onPress={this.props.getMyCouponsKeyAfter} />
        </View>
      );
    }
    return null; */
  };

  render() {
    const { fromList } = this.props;
    console.log(fromList);
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          keyExtractor={item => item.key}
          //ListFooterComponent={this.renderFooter}
          data={fromList}
          renderItem={({ item, index }) =>
            <Card
              type={CARD_TYPE.LIST_FROM}
              item={item}
              onPress={() => this.onPressList(item)}
              onPressX={() => this.onPressX(item, index)}
              showXButton={true}
            />}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    fromList: state.from.fromList
  };
};

export default connect(mapStateToProps, { getFromList, getFromListAfter })(FromScreen);

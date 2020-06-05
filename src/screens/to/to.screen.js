import React, { Component } from 'react';
import { FlatList, Image, View, Text, Alert } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import Card from '../../components/Card';
import Button from '../../components/SubmitButton';

import { CARD_TYPE, LIST_STATUS } from '../../constants';
import { getToList, getToListAfter, deleteTo } from '../../store/modules/to';

import * as ToService from '../../services/ToService';

class ToScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.props.getToList();
  }
  componentWillUnmount() {
    //ToService.removeListeners();
  }

  onPressList = (item, index) => {
    this.props.navigation.navigate('To Detail', { index: index, title: item.title });
  };

  onPressX = (item, index) => {
    Alert.alert('Coupons', `Do you really want to delete ${item.title}?`, [
      {
        text: 'Cancel'
      },
      {
        text: 'Delete',
        onPress: () => {
          ToService.deleteTo(item.key)
            .then(() => {
              this.props.deleteTo(item.key, index);
            })
            .catch(() => {
              Alert.alert('Coupons', 'Something went wrong. Please try again');
            });
        }
      }
    ]);
  };

  renderFooter = () => {
    const { toKeys, toLastKey } = this.props;
    const index = _.findIndex(toKeys, { key: toLastKey });

    if (index + 1 < toKeys.length) {
      return (
        <View style={{ flex: 1 }}>
          <Button label="Load More" onPress={this.props.getToListAfter} />
        </View>
      );
    }
    return null;
  };

  render() {
    const { toList } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {toList.length
          ? <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={false}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={this.renderFooter}
              data={toList}
              renderItem={({ item, index }) =>
                <Card
                  type={CARD_TYPE.LIST_TO}
                  item={item}
                  onPress={() => this.onPressList(item, index)}
                  onPressX={() => this.onPressX(item, index)}
                  showXButton={item.status === LIST_STATUS.DELETED}
                  pressed={false}
                />}
            />
          : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text
                style={{
                  marginLeft: 20,
                  marginTop: 10,
                  color: 'gray',
                  fontSize: 20
                }}
              >
                You didn't send any coupons yet
              </Text>
            </View>}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    toList: state.to.toList,
    toKeys: state.to.toKeys,
    toLastKey: state.to.toLastKey
  };
};

export default connect(mapStateToProps, { getToList, getToListAfter, deleteTo })(ToScreen);

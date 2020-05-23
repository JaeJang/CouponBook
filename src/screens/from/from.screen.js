import React, { Component } from 'react';
import { FlatList, Image, View, Text, Alert } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import Card from '@components/Card';
import Button from '@components/SubmitButton';

import { CARD_TYPE, LIST_STATUS } from '@constants';
import { getFromList, getFromListAfter, deleteFrom } from '../../store/modules/from';

import * as FromService from '../../services/FromService';

class FromScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.props.getFromList();
  }
  componentWillUnmount() {
    //FromService.removeListeners();
  }

  onPressList = (item, index) => {
    this.props.navigation.navigate('From Detail', { index: index, title: item.title });
  };

  onPressX = (item, index) => {
    Alert.alert('Coupons', `Do you really want to delete ${item.title}?`, [
      {
        text: 'Cancel'
      },
      {
        text: 'Delete',
        onPress: () => {
          const userKey = this.props.fromKeys[index].userKey;
          FromService.deleteFrom(item.key, userKey, item.title)
            .then(() => {
              this.props.deleteFrom(item.key, index);
            })
            .catch(() => {
              Alert.alert('Coupons', 'Something went wrong. Please try again');
            });
        }
      }
    ]);
  };

  renderFooter = () => {
    const { fromKeys, fromLastKey } = this.props;
    const index = _.findIndex(fromKeys, { key: fromLastKey });
    if (index + 1 < fromKeys.length) {
      return (
        <View style={{ flex: 1 }}>
          <Button label="Load More" onPress={this.props.getFromListAfter} />
        </View>
      );
    }
    return null;
  };

  render() {
    const { fromList } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {fromList.length
          ? <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={false}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={this.renderFooter}
              data={fromList}
              renderItem={({ item, index }) =>
                <Card
                  type={CARD_TYPE.LIST_FROM}
                  item={item}
                  onPress={() => this.onPressList(item, index)}
                  onPressX={() => this.onPressX(item, index)}
                  showXButton={true}
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
                You didn't get any coupons yet
              </Text>
            </View>}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    fromList: state.from.fromList,
    fromKeys: state.from.fromKeys,
    fromLastKey: state.from.fromLastKey
  };
};

export default connect(mapStateToProps, { getFromList, getFromListAfter, deleteFrom })(FromScreen);

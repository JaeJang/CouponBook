import React, { Component } from 'react';
import { FlatList, Image, View, Text, Alert } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import Card from '@components/Card';
import Button from '@components/SubmitButton';

import { CARD_TYPE, LIST_STATUS } from '@constants';
import { getFromList, getFromListAfter, deleteFrom, setFirstTimeLoaded } from '../../store/modules/from';

import * as FromService from '../../services/FromService';
import EmptyMessage from '../../components/EmptyMessage';

class FromScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    if (!this.props.firstTimeLoaded) {
      this.props.getFromList();
      this.props.setFirstTimeLoaded();
    }
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
          : <EmptyMessage message="You didn't get any coupons yet" />}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    fromList: state.from.fromList,
    fromKeys: state.from.fromKeys,
    fromLastKey: state.from.fromLastKey,
    firstTimeLoaded: state.from.firstTimeLoaded
  };
};

export default connect(mapStateToProps, { getFromList, getFromListAfter, deleteFrom, setFirstTimeLoaded })(FromScreen);

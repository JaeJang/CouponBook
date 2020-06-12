import React, { Component } from 'react';
import { FlatList, View, Text, Alert } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import Card from '../../components/Card';
import Button from '../../components/SubmitButton';

import { CARD_TYPE, LIST_STATUS } from '../../constants';
import { getToList, getToListAfter, deleteTo ,setFirstTimeLoaded } from '../../store/modules/to';

import * as ToService from '../../services/ToService';
import EmptyMessage from '../../components/EmptyMessage';

class ToScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    if (!this.props.firstTimeLoaded) {
      this.props.getToList();
      this.props.setFirstTimeLoaded();
    }
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
          : <EmptyMessage 
            message="You didn't send any coupons yet"
          />}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    toList: state.to.toList,
    toKeys: state.to.toKeys,
    toLastKey: state.to.toLastKey,
    firstTimeLoaded: state.to.firstTimeLoaded
  };
};

export default connect(mapStateToProps, { getToList, getToListAfter, deleteTo, setFirstTimeLoaded })(ToScreen);

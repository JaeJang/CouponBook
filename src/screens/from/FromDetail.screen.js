import React, { Component } from "react";
import { FlatList, View } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Card from "../../components/Card";
import * as FromService from "../../services/FromService";
import { CARD_TYPE } from "../../constants";
import FromToDetail from "../../components/FromToDetail";

class FromDetailScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: navigation.getParam("title", ""),
      //header: navigation.getParam("headerShown", true)
      headerShown: false
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      index: props.navigation.getParam("index")
    };
  }

  onPressCard = () => {
    this.props.navigation.setParams({ headerShown: null });
    this.setState({ scroll: false });
  };

  onPressCardBack = () => {
    this.props.navigation.setParams({ headerShown: true });
    this.setState({ scroll: true });
  };

  onPressMainButton = (item, index) => {
    const key = this.props.fromList[this.state.index].key;
    FromService.requestCoupon(key, index, item.createdBy, item.title)
      .catch(error => Alert.alert("From", "Something went wrong. Please try again later"));
  }

  render() {
    const item = this.props.fromList[this.state.index];
    return (
      <FromToDetail 
        list={item.list}
        type={CARD_TYPE.COUPON}
        onPressMainButton={this.onPressMainButton}
      />
    );
  }
}

FromDetailScreen.propTypes = {};

const mapStateToProps = state => ({
  fromList: state.from.fromList
});


export default connect(mapStateToProps, null)(FromDetailScreen);

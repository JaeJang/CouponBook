import React, { Component } from "react";
import { FlatList, View } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Card from "../../components/Card";
import * as ToService from "../../services/ToService";
import { CARD_TYPE } from "../../constants";
import FromToDetail from "../../components/FromToDetail";

class ToDetailScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: navigation.getParam('title', ''),
      //header: navigation.getParam("headerShown", true)
      headerShown: false
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      index: props.navigation.getParam('index'),
      //item: null
    };
  }

  componentDidMount() {
    //this.setState({ item: this.props.toList[this.state.index]});
  }

  onPressCard = () => {
    //this.props.navigation.setParams({ headerShown: null });
  };

  onPressCardBack = () => {
    //this.props.navigation.setParams({ headerShown: true });
  };

  onPressMainButton = (item, index) => {
    
  }

  render() {
    const item  = this.props.toList[this.state.index];
    return (
      <FromToDetail 
        list={item.list}
        type={CARD_TYPE.COUPON_TO}
        onPressMainButton={this.onPressMainButton}
      />
    );
  }
}

const mapStateToProps = state => ({
  toList: state.to.toList
});


export default connect(mapStateToProps, null)(ToDetailScreen);

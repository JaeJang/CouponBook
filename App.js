import React, { Component } from 'react';
import { Root, Text } from 'native-base';
import store from './src/store';
import { Provider } from 'react-redux';
import LoginScreen from './src/screens/login.screen';
import Loader from '@components/loader';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root>
          <Loader />
          <LoginScreen />
        </Root>
      </Provider>
    );
  }
}

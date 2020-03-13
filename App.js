import React, { Component } from 'react';
import { Root, View } from 'native-base';
import store from './src/store';
import { Provider } from 'react-redux';
import LoginScreen from './src/screens/login.screen';
import Loader from '@components/loader';
import AppNavigator from './src/navigation/app.navigation';
import { SafeAreaView } from 'react-navigation';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>

        <Root>
          <View style={{flex:1, paddingTop:30, backgroundColor:'rgb(242, 242, 242)'}}>
            <Loader />
            <AppNavigator />
            {/* <LoginScreen /> */}

          </View>
        </Root>


      </Provider>
    );
  }
}

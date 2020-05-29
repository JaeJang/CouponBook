import React, { Component } from 'react';
import { View, Text, Animated, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Card, CardItem, Form, Input, Item, Label, Button } from 'native-base';
import { connect } from 'react-redux';
import Switch from 'react-native-switch-pro';

import firebase from '../configs/firebase';

import * as authenticationAction from '@modules/authentication';
import * as ProfileService from '../services/ProfileService';
import AnimatedName from '@components/animatedName';
import { sleep } from '@utils/sleep';
import { isEmailValid } from '../utils/validate';
import { timingAnimation } from '../utils/animation';

const LOGIN = 'LOGIN';
const SIGNUP = 'SIGNUP';

//TODO: replace
//const INIT_ANI_START = 1500;
//const SLEEP_BETWEEN_NAME_FORM = 1000;
const INIT_ANI_START = 0;
const SLEEP_BETWEEN_NAME_FORM = 0;

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.nameFlex = new Animated.Value(0);
    this.loginFormOpacity = new Animated.Value(0);
    this.signupFormOpacity = new Animated.Value(0);
    this.rememberMe = false;
    this.originalRememberMe = false;

    this.state = {
      data: {
        email: '',
        password: '',
        passwordConfirm: '',
        firstName: '',
        lastName: ''
      },
      screen: LOGIN,
      rememberMe: false,
      originalRememberMe: false
    };
  }

  async componentDidMount() {
    this.initialAnimationStart(INIT_ANI_START, user);
    const user = firebase.getUser();
    //TODO: uncomment
    //await sleep(1700);
    const rememberMe = await ProfileService.getRememberMe();
    if (rememberMe) {
      this.setState({
        rememberMe: true,
        originalRememberMe: true,
        data: { ...this.state.data, email: rememberMe.email, password: rememberMe.password }
      });
    }
  }

  initForm = () => {
    this.setState({
      ...this.state,
      data: {
        email: '',
        password: '',
        passwordConfirm: '',
        firstName: '',
        lastName: ''
      }
    });
  };

  initialAnimationStart = async (milisec, user) => {
    await sleep(milisec);
    timingAnimation(this.nameFlex);
    await sleep(SLEEP_BETWEEN_NAME_FORM);
    timingAnimation(this.loginFormOpacity);
    /* setTimeout(async () => {
      timingAnimation(this.nameFlex);

      await sleep(SLEEP_BETWEEN_NAME_FORM);

      //if (!user) {
      timingAnimation(this.loginFormOpacity);
      //}
    }, milisec); */
  };

  handleLogin = () => {
    const { email, password } = this.state.data;
    if (!email || !password) {
      Alert.alert('Login', 'Please enter email and password!');
      return;
    } else {
      this.props.login(this.state.data, () => {
        if (this.state.originalRememberMe !== this.state.rememberMe) {
          ProfileService.setRememberme(this.state.rememberMe);
          if (this.state.rememberMe) {
            ProfileService.setCredentials(email, password);
          } else {
            ProfileService.setCredentials('', '');
          }
        }
        this.props.navigation.navigate('From');
      });
    }
  };

  handleSignup = async () => {
    const { firstName, lastName, email, password, passwordConfirm } = this.state.data;
    if (!firstName || !lastName || !email || !password || !passwordConfirm) {
      Alert.alert('Sign Up', 'Please enter all fields');
      return;
    } else if (!isEmailValid(email)) {
      Alert.alert('Sign Up', 'Invalid Email Address');
      this.emailRef.focus();
    } else if (password !== passwordConfirm) {
      Alert.alert('Sign Up', 'Passwords are not matched');
      this.setState({ password: '', passwordConfirm: '' });
      this.passwordRef.focus();
    } else {
      this.props.signup(
        this.state.data,
        // onSuccess
        () => {
          Alert.alert('We sent a verfication email! Please vertify and log in.');
          this.initForm();
          this.switchToLogin();
        },
        // onFailed
        error => {
          Alert.alert(error);
        }
      );
    }
  };

  switchToSignup = async () => {
    timingAnimation(this.loginFormOpacity, 0, 500);
    await sleep(500);
    this.initForm();
    this.setState({ screen: SIGNUP });
    timingAnimation(this.signupFormOpacity, 1, 500);
  };

  switchToLogin = async () => {
    timingAnimation(this.signupFormOpacity, 0, 500);
    await sleep(500);
    this.initForm();
    this.setState({ screen: LOGIN });
    timingAnimation(this.loginFormOpacity, 1, 500);
  };

  renderButtons = () => {
    const { screen } = this.state;
    const onPressLogin = screen === LOGIN ? this.handleLogin : this.switchToLogin;
    const onPressSignup = screen === SIGNUP ? this.handleSignup : this.switchToSignup;
    return (
      <View>
        <TouchableOpacity style={[styles.button]} onPress={onPressLogin}>
          <Text style={[styles.buttonText]}>LOG IN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#DDDDDD' }]} onPress={onPressSignup}>
          <Text style={[styles.buttonText]}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderLoginForm = () => {
    const range = [0, 0.25, 0.5, 0.75, 1];
    const { screen, rememberMe } = this.state;
    const opacity = this.loginFormOpacity.interpolate({
      inputRange: screen === LOGIN ? range : range.reverse(),
      outputRange: screen === LOGIN ? range : range.reverse()
    });

    return (
      <Animated.View style={{ opacity }}>
        <Form style={styles.form}>
          <Item full style={{}}>
            <Input
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#fff"
              placeholder="Please Enter Email"
              ref={ref => (this.emailRef = ref)}
              required={true}
              value={this.state.data.email}
              keyboardType="email-address"
              onChangeText={value => this.setState({ data: { ...this.state.data, email: value } })}
            />
          </Item>
          <Item full>
            <Input
              style={styles.input}
              placeholderTextColor="#fff"
              placeholder="Please Enter Password"
              secureTextEntry={true}
              value={this.state.data.password}
              onChangeText={value => this.setState({ data: { ...this.state.data, password: value } })}
            />
          </Item>
          {this.renderButtons()}
          <Item style={{ borderColor: 'transparent' }}>
            <Text style={{ color: '#fff', fontWeight: '500', marginRight: 15 }}>Remember me</Text>
            <Switch
              value={rememberMe}
              backgroundActive={'#00aaff'}
              onSyncPress={value => this.setState({ rememberMe: value })}
            />
          </Item>
        </Form>
      </Animated.View>
    );
  };

  renderSignupForm = () => {
    const range = [0, 0.25, 0.5, 0.75, 1];
    const { screen } = this.state;
    const opacity = this.signupFormOpacity.interpolate({
      inputRange: screen === SIGNUP ? range : range.reverse(),
      outputRange: screen === SIGNUP ? range : range.reverse()
    });
    return (
      <Animated.ScrollView style={{ opacity }}>
        <Form style={styles.form}>
          <Item>
            <Input
              style={[styles.input, styles.inputName]}
              placeholder="First Name"
              placeholderTextColor="#fff"
              value={this.state.firstName}
              onChangeText={value => this.setState({ data: { ...this.state.data, firstName: value } })}
            />
            <Input
              style={[styles.input, styles.inputName]}
              placeholder="Last Name"
              placeholderTextColor="#fff"
              value={this.state.data.lastName}
              onChangeText={value => this.setState({ data: { ...this.state.data, lastName: value } })}
            />
          </Item>
          <Item full style={{}}>
            <Input
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#fff"
              placeholder="Please Enter Email"
              keyboardType="email-address"
              ref={ref => (this.emailRef = ref)}
              required={true}
              value={this.state.data.email}
              onChangeText={value => this.setState({ data: { ...this.state.data, email: value } })}
            />
          </Item>
          <Item full>
            <Input
              style={styles.input}
              placeholderTextColor="#fff"
              placeholder="Please Enter Password"
              secureTextEntry={true}
              value={this.state.data.password}
              ref={ref => (this.passwordRef = ref)}
              onChangeText={value => this.setState({ data: { ...this.state.data, password: value } })}
            />
          </Item>
          <Item full>
            <Input
              style={styles.input}
              placeholderTextColor="#fff"
              placeholder="Confirm Your Password"
              secureTextEntry={true}
              value={this.state.data.passwordConfirm}
              onChangeText={value => this.setState({ data: { ...this.state.data, passwordConfirm: value } })}
            />
          </Item>
          {this.renderButtons()}
        </Form>
      </Animated.ScrollView>
    );
  };

  render() {
    const { screen } = this.state;
    const flex = this.nameFlex.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [8, 6, 4, 2, 1]
    });

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.center, { flex }]}>
          <Animated.View style={{}}>
            <AnimatedName />
          </Animated.View>
          <Animated.View />
        </Animated.View>
        <Animated.View style={styles.loginFormContainer}>
          {screen === LOGIN && this.renderLoginForm()}
          {screen === SIGNUP && this.renderSignupForm()}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginFormContainer: {
    flex: 3
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    padding: 10
  },
  buttonText: {
    fontSize: 15
  },
  input: {
    color: '#fff',
    height: 50
  },
  inputName: {
    flex: 1
  },
  form: {
    padding: 10,
    margin: 10,
    backgroundColor: 'rgb(146,146,146)',
    borderRadius: 10
  },
  inputLabel: {
    color: 'rgba(255, 255, 255, 0.8)'
  }
});

const mapStateToProps = state => {
  return {
    isLoading: state.authentication.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: (data, onSuccess) => dispatch(authenticationAction.login(data, onSuccess)),
    signup: (data, onSuccess, onFailed) => dispatch(authenticationAction.signup(data, onSuccess, onFailed))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

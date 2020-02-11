import React, { Component } from 'react';
import { View, Text, Animated, StyleSheet, TextInput, Alert } from 'react-native';
import { Card, CardItem, Form, Input, Item, Button, Label } from 'native-base';

import firebase from '../configs/firebase';

import AnimatedName from '@components/animatedName';
import { sleep } from '@utils/sleep';

const LOGIN = 'LOGIN';
const SIGNUP = 'SIGNUP';

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.nameFlex = new Animated.Value(0);
    this.loginFormOpacity = new Animated.Value(0);
    this.signupFormOpacity = new Animated.Value(0);

    this.state = {
      email: '',
      password: '',
      passwordConfirm: '',
      firstName: '',
      lastName: '',
      screen: LOGIN
    };
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    this.initialAnimationStart(1000, user);
  }

  initForm = () => {
    this.setState({
      email: '',
      password: '',
      passwordConfirm: '',
      firstName: '',
      lastName: ''
    });
  };

  initialAnimationStart = (milisec, user) => {
    setTimeout(async () => {
      this.timingAnimation(this.nameFlex);

      await sleep(1000);

      if (!user) {
        this.timingAnimation(this.loginFormOpacity);
      }
    }, milisec);
  };

  timingAnimation = (value, toValue = 1, duration = 1000) => {
    Animated.timing(value, {
      toValue: toValue,
      duration: duration
    }).start();
  };

  handleLogin = async () => {
    if (this.state.screen === LOGIN) {
      const { email, password } = this.state;
      if (!email || !password) {
        Alert.alert('Login', 'Please enter email and password!');
        return;
      }

      firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        Alert.alert('success');
      });
    } else {
      this.timingAnimation(this.signupFormOpacity, 0, 500);
      await sleep(500);
      this.initForm();
      this.setState({ screen: LOGIN });
      this.timingAnimation(this.loginFormOpacity, 1, 500);
      //this.switchScreen(this.signupFormOpacity, this.loginFormOpacity, LOGIN);
    }
  };

  handleSignup = async () => {
    if (this.state.screen === SIGNUP) {
      const { firstName, lastName, email, password, passwordConfirm } = this.state;
      if (!firstName || !lastName || !email || !password || !passwordConfirm) {
        Alert.alert('Sign Up', 'Please enter all fields');
        return;
      } else {
      }
    } else {
      this.timingAnimation(this.loginFormOpacity, 0, 500);
      await sleep(500);
      this.initForm();
      this.setState({ screen: SIGNUP });
      this.timingAnimation(this.signupFormOpacity, 1, 500);
      //this.switchScreen(this.loginFormContainer, this.signupFormOpacity, SIGNUP);
    }
  };

  switchScreen = async (valueA, valueB, screenA) => {
    this.timingAnimation(valueA, 0, 500);
    await sleep(500);
    this.initForm();
    this.setState({ screen: screenA });
    this.timingAnimation(valueB, 1, 500);
  };

  renderLoginForm = () => {
    const range = [0, 0.25, 0.5, 0.75, 1];
    const { screen } = this.state;
    const opacity = this.loginFormOpacity.interpolate({
      inputRange: screen === LOGIN ? range : range.reverse(),
      outputRange: screen === LOGIN ? range : range.reverse()
    });

    return (
      <Animated.View style={{ opacity }}>
        <Form style={styles.form}>
          <Item full style={{}}>
            <TextInput
              style={styles.input}
              placeholderTextColor="#fff"
              placeholder="Please Enter Email"
              ref={ref => (this.inputRef = ref)}
              required={true}
              value={this.state.email}
              onChangeText={value => this.setState({ email: value })}
            />
          </Item>
          <Item full>
            <TextInput
              style={styles.input}
              placeholderTextColor="#fff"
              placeholder="Please Enter Password"
              type={'password'}
              value={this.state.password}
              onChangeText={value => this.setState({ password: value })}
            />
          </Item>
          <Button full block style={styles.button} onPress={this.handleLogin}>
            <Text>Log In</Text>
          </Button>
          <Button full block style={[styles.button, { backgroundColor: '#bcdeff' }]} onPress={this.handleSignup}>
            <Text>Sign Up</Text>
          </Button>
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
            <TextInput
              style={[styles.input, styles.inputName]}
              placeholder="First Name"
              placeholderTextColor="#fff"
              value={this.state.firstName}
              onChangeText={value => this.setState({ firstName: value })}
            />
            <TextInput
              style={[styles.input, styles.inputName]}
              placeholder="Last Name"
              placeholderTextColor="#fff"
              value={this.state.lastName}
              onChangeText={value => this.setState({ lastName: value })}
            />
          </Item>
          <Item full style={{}}>
            <TextInput
              style={styles.input}
              placeholderTextColor="#fff"
              placeholder="Please Enter Email"
              ref={ref => (this.inputRef = ref)}
              required={true}
              value={this.state.email}
              onChangeText={value => this.setState({ email: value })}
            />
          </Item>
          <Item full>
            <TextInput
              style={styles.input}
              placeholderTextColor="#fff"
              placeholder="Please Enter Password"
              type={'password'}
              value={this.state.password}
              onChangeText={value => this.setState({ password: value })}
            />
          </Item>
          <Item full>
            <TextInput
              style={styles.input}
              placeholderTextColor="#fff"
              placeholder="Confirm Your Password"
              type={'password'}
              value={this.state.passwordConfirm}
              onChangeText={value => this.setState({ passwordConfirm: value })}
            />
          </Item>
          <Button full block style={styles.button} onPress={this.handleLogin}>
            <Text>Log In</Text>
          </Button>
          <Button full block style={[styles.button, { backgroundColor: '#bcdeff' }]} onPress={this.handleSignup}>
            <Text>Sign Up</Text>
          </Button>
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
    borderRadius: 5
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

export default LoginScreen;

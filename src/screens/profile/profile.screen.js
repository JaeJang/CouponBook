import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Alert, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Fab, Icon } from 'native-base';
import { TextInput } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import { SwipeRow } from 'react-native-swipe-list-view';
import Switch from 'react-native-switch-pro';
import _ from 'lodash';
import moment from 'moment';

import DefaultImage from '../../images/default_image.png';
import firebase from '../../configs/firebase';

import SwipeRowAlert from '@components/SwipeRowAlert';
import { ALERT_TYPE, COUPON_STATUS } from '@constants';

import * as ProfileService from '@service/ProfileService';
import * as FromService from '@service/FromService';
import { deleteToAlert, deleteFromAlert, switchDownloadOption } from '../../store/modules/profile';
import { reset } from '@modules/from';

const deviceWidth = Dimensions.get('window').width;

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayNameEditable: false,
      displayName: '',
      image: '',
      alerts: {}
    };
  }
  componentDidMount() {
    const user = firebase.getUser();
    this.setState({
      displayName: _.get(user, 'displayName', ''),
      image: _.get(user, 'photoURL', '')
    });
    this.props.navigation.setParams({ logout: this.logout });
  }

  logout = () => {
    this.props.reset();
    ProfileService.logout();
    this.props.navigation.navigate('Login');
  };

  openImagePicker = () => {
    ImagePicker.openPicker({
      width: 400,
      includeBase64: true,
      cropping: true,
      compressImageQuality: 0.8
    }).then(image => {
      ProfileService.updatePhotoUrl(image.path, url => this.setState({ image: url }));
      /* const imageSource = `data:${image.mime}$;base64,${image.data}`;
      this.setState({ image: imageSource });

      const user = firebase.auth().currentUser; */
    });
    /* ImagePicker.launchImageLibrary({ maxHeight: 300, quality: 0.5 }, response => {
      //console.log(response);
      if (response.didCancel) {
      } else if (response.error) {
        Alert.alert("Image", "Please try again -" + response.error);
      } else {
        updatePhotoUrl(response.uri, url => this.setState({ image: url }));
      }
    }); */
  };

  onPressToAlert = async item => {
    this.props.navigation.navigate('AlertCard', { item });
  };

  onDeleteToAlert = key => {
    ProfileService.deleteToAlert(key);
    this.props.deleteToAlert(key);
  };

  onDeleteFromAlert = key => {
    ProfileService.deleteFromAlert(key);
    this.props.deleteFromAlert(key);
  };

  onPressDoNoDownload = value => {
    this.props.switchDownloadOption(value);
  }

  render() {
    const { user } = this.props;
    const { displayNameEditable, image, displayName } = this.state;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.displayName}>
          {!displayNameEditable
            ? <TouchableOpacity
                onPress={() => {
                  this.setState({ displayNameEditable: true });
                }}
                style={styles.touchableDisplayName}
              >
                <Text style={{ fontSize: 30 }}>
                  {displayName}
                </Text>
                <Icon name="md-create" style={{ marginLeft: 10, color: 'gray', fontSize: 20 }} />
              </TouchableOpacity>
            : <TextInput
                placeholder="Enter"
                onChangeText={text => this.setState({ displayName: text })}
                value={this.state.displayName}
                ref="displayNameEdit"
                style={styles.displayNameInput}
                autoFocus={true}
                onBlur={() => this.setState({ displayNameEditable: false })}
              />}
        </View>
        <View>
          <TouchableOpacity onPress={this.openImagePicker}>
            {!image
              ? <Image source={DefaultImage} style={{ height: 130, width: deviceWidth }} resizeMode="stretch" />
              : <Image source={{ uri: image }} style={{ height: 130, width: deviceWidth }} resizeMode="stretch" />}
          </TouchableOpacity>
          <Text style={styles.imageClickText}>Touch image above to change your basic image</Text>
        </View>
        <View
          style={[
            styles.section,
            {
              marginTop: 20,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center'
            }
          ]}
        >
          <View>
            <Text style={{ fontWeight: '500', fontSize: 15 }}>Do not download images</Text>
            <Text style={{ fontWeight: '300', fontSize: 12 }}>Downloading image may increase data usage </Text>
          </View>
          <Switch value={this.props.imageDownloadDisabled} backgroundActive={'#00aaff'} onSyncPress={this.onPressDoNoDownload} />
        </View>
        <View style={[styles.section]}>
          <Text style={[styles.alertHeader]}>To Alerts</Text>
          {this.props.toAlerts.length !== 0
            ? this.props.toAlerts.map((item, index) => {
                return (
                  <SwipeRowAlert
                    key={index}
                    item={item}
                    onRowPress={this.onPressToAlert}
                    onDelete={this.onDeleteToAlert}
                  />
                );
              })
            : <Text style={styles.noAlertMessage}>You don't have any Alerts</Text>}
        </View>
        <View style={[styles.section]}>
          <Text style={[styles.alertHeader]}>From Alerts</Text>
          {this.props.fromAlerts.length !== 0
            ? this.props.fromAlerts.map((item, index) => {
                return (
                  <SwipeRowAlert
                    key={index}
                    item={item}
                    onRowPress={this.onPressToAlert}
                    onDelete={this.onDeleteFromAlert}
                  />
                );
              })
            : <Text style={styles.noAlertMessage}>You dont have any Alerts</Text>}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  displayName: {
    alignItems: 'center',
    marginVertical: 20
  },
  touchableDisplayName: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  displayNameInput: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    fontSize: 30
  },
  imageClickText: {
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
    color: 'gray',
    marginTop: 5
  },
  toAlertContainer: {
    marginTop: 20
  },
  alertHeader: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 10
  },
  standaloneRowFront: {
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    height: 50,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5
  },
  standaloneRowBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15
  },
  backTextWhite: {
    color: '#FFF',
    fontSize: 20
  },
  noAlertMessage: {
    marginLeft: 20,
    marginTop: 10,
    color: 'gray'
  },
  section: {
    marginTop: 0,
    marginBottom: 10,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5
  }
});

const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    toAlerts: state.profile.toAlerts,
    fromAlerts: state.profile.fromAlerts,
    toList: state.to.toList,
    imageDownloadDisabled: state.profile.imageDownloadDisabled
  };
};

export default connect(mapStateToProps, { deleteFromAlert, deleteToAlert, switchDownloadOption, reset })(Profile);

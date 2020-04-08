import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Fab, Icon } from 'native-base';
import { TextInput } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
//import DefaultImage from '../../images/74951747-0745-4C0B-A93C-A78E53502AC4.jpg';
import DefaultImage from '../../images/default_image.png';
import firebase from '../../configs/firebase';
//import ImagePicker from 'react-native-image-picker';

import _ from 'lodash';
import * as ProfileService from '@service/profileService';

const deviceWidth = Dimensions.get('window').width;

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayNameEditable: false,
      displayName: '',
      image: ''
    };
  }
  componentDidMount() {
    const user = firebase.getUser();
    console.log(user);
    this.setState({
      displayName: _.get(user, 'displayName', ''),
      image: _.get(user, 'photoURL', '')
    });
  }

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
        Alert.alert('Image', 'Please try again -' + response.error);
      } else {
        updatePhotoUrl(response.uri, url => this.setState({ image: url }));
      }
    }); */
  };

  render() {
    const { user } = this.props;
    const { displayNameEditable, image, displayName } = this.state;
    return (
      <View style={styles.container}>
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
        <TouchableOpacity onPress={this.openImagePicker}>
          {!image
            ? <Image source={ DefaultImage } style={{ height: 130, width: deviceWidth }} resizeMode="stretch" />
            : <Image source={{ uri: image }} style={{ height: 130, width: deviceWidth }} resizeMode="stretch" />}
        </TouchableOpacity>
        <Text style={styles.imageClickText}>Touch image above to change your basic image</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  },
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
  }
});

const mapStateToProps = state => {
  return {
    user: state.authentication.user
  };
};

export default connect(mapStateToProps, null)(Profile);

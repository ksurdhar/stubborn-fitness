import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Dimensions,
  Button,
  Image
} from 'react-native'
import firebase from 'firebase'
import Expo from 'expo'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { MaterialIcons } from '@expo/vector-icons'

import KButton from './reusable/button'
import BasicButton from './reusable/basicButton'
import KInput from './reusable/input'
import PressCapture from './reusable/pressCapture'
import { common, DYNAMIC } from './reusable/common'

import { login, loginFailed } from '../redux/actions/authActions'
import * as UserActions from '../redux/actions/userActions'

import config from '../../config.js'
import store from '../redux/store.js'

const logoURI =  Expo.Asset.fromModule(require('../../assets/images/logo.png')).uri
const googleURI = Expo.Asset.fromModule(require('../../assets/images/test.png')).uri
const facebookURI = Expo.Asset.fromModule(require('../../assets/images/fbwhite.png')).uri

const LOGIN = "I already have an account"
const REGISTER = "Register"

async function signInWithGoogleAsync() {
  try {
    const result = await Expo.Google.logInAsync({
      iosClientId: config.IOS_CLIENT_ID,
      scopes: ['profile', 'email'],
    })
    if (result.type === 'success') {
      const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken)
      firebase.auth().signInWithCredential(credential)
      .catch((error) => {
        console.log('ERROR - signing into firebase with google credentials:', error)
      })
    } else {
      return {cancelled: true}
    }
  } catch(e) {
    console.log('error signing into google', e)
  }
}

async function signInWithFBAsync() {
  try {
    const { token, type } = await Expo.Facebook.logInWithReadPermissionsAsync(config.FACEBOOK_CLIENT_ID, {
      permissions: ['public_profile', 'email']
    })

    if (type === 'success') {
      fetch(`https://graph.facebook.com/me?access_token=${token}`).then((res) => res.json()).then((userInfo) => {
        fetch(`https://graph.facebook.com/v3.1/${userInfo.id}?fields=email&access_token=${token}`).then((res) => res.json()).then((emailInfo) => {

          const credential = firebase.auth.FacebookAuthProvider.credential(token)
          firebase.auth().signInWithCredential(credential)
          .catch((error) => {
            console.log('ERROR - signing into firebase with facebook credentials:', error)
          })
        })
      })
    } else {
      console.log('signing into facebook failed', type)
    }
  } catch(e) {
    console.log('error signing into facebook', e)
  }
}

class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      action: LOGIN,
      email: '',
      password: '',
      passwordConfirmation: ''
    }

    firebase.auth().onAuthStateChanged((user) => {
      console.log('AUTH CHANGED', user)
      if (user != null && !this.props.isLoggedIn) {
        console.log("We are authenticated now!", user)
        const userObj = {
          email: user.email,
          name: user.displayName,
          uid: user.uid,
          userID: user.uid,
        }

        props.dispatchLogin(userObj)
        // only conditionally do this
        props.addUser(userObj)
      }
    })
  }

  onGoogleSubmit = () => {
    signInWithGoogleAsync()
  }

  onFBSubmit = () => {
    signInWithFBAsync()
  }

  onToggleAction = () => {
    this.setState({ action: this.state.action === LOGIN ? REGISTER : LOGIN })
  }

  renderAuthButtons() {
    const { width } = Dimensions.get('window')

    const buttonStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'left',
      width: (width - 36) / 2,
      height: 56,
      shadowColor: DYNAMIC.black10,
      paddingRight: 10,
      paddingLeft: 10,
      shadowOpacity: 0.3,
      shadowOffset: { width: 1, height: 1 },
      shadowRadius: 2
    }

    return (
      <View style={[common.row]}>
        <BasicButton onPress={() => this.onGoogleSubmit()}>
          <View style={[buttonStyle, {backgroundColor: DYNAMIC.white}]}>
            <Image source={{uri: googleURI}} style={{width: 50, height: 50, verticalAlign: 'text-bottom'}} />
            <Text style={{ fontFamily: 'roboto-medium', fontSize: 16, color: DYNAMIC.black8, marginLeft: 8 }}>
              Google
            </Text>
          </View>
        </BasicButton>
        <BasicButton onPress={() => this.onFBSubmit()}>
          <View style={[buttonStyle, {backgroundColor: 'rgb(59, 89, 152)'}]}>
            <Image source={{uri: facebookURI}} style={{width: 40, height: 40, verticalAlign: 'text-bottom', marginLeft: 10}} />
            <Text style={{ fontFamily: 'roboto-medium', fontSize: 16, color: DYNAMIC.white, marginLeft: 20 }}>
              Facebook
            </Text>
          </View>
        </BasicButton>
      </View>
    )
  }

  renderToggleLink() {
    return (
      <View style={[common.row]}>
        <BasicButton onPress={() => this.onToggleAction()}>
          <Text style={{color: DYNAMIC.white, textDecorationLine: 'underline'}}>
            {this.state.action === LOGIN ? `${REGISTER}` : `${LOGIN}`}
          </Text>
        </BasicButton>
      </View>
    )
  }

  renderLogo() {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 50, marginBottom: 40}}>
        <Image source={{uri: logoURI}} style={{ width: 300, height: 200}}/>
      </View>
    )
  }

  renderInputs() {
    function generateLabel(val) {
      return (
        <Text style={{
          fontFamily: 'rubik',
          fontSize:20,
          color: DYNAMIC.white
        }}>
          { val }
        </Text>
      )
    }

    const submitButtonEnabled = () => {
      if (this.state.action === REGISTER) {
        return this.state.email.length > 0
          && this.state.password.length > 0
          && this.state.passwordConfirmation.length > 0
      } else {
        return this.state.email.length > 0
          && this.state.password.length > 0
      }
    }

    return (
      <View style={{marginBottom: 20}}>
        <KInput
          value={this.state.email}
          label={generateLabel('Email')}
          onChangeText={(val) => this.setState({ email: val })}
          ref={'email-input'}
          fontSize={24}
          noValidation={true}
          fixedLabel={true}
          animate={true}
          invert={true}
          style={{marginBottom: 30}}
        />
        <KInput
          value={this.state.password}
          label={generateLabel('Password')}
          onChangeText={(val) => this.setState({ password: val })}
          ref={'password-input'}
          fontSize={24}
          noValidation={true}
          fixedLabel={true}
          animate={true}
          invert={true}
          style={{marginBottom: 30}}
        />
        { this.state.action === REGISTER
          ? (
            <KInput
              value={this.state.passwordConfirmation}
              label={generateLabel('Confirm Password')}
              onChangeText={(val) => this.setState({ passwordConfirmation: val })}
              ref={'confirmation-input'}
              fontSize={24}
              noValidation={true}
              fixedLabel={true}
              animate={true}
              invert={true}
            />
          )
          : null
        }
        <KButton
          value={this.state.action === REGISTER ? 'Sign Up' : 'Sign In'}
          isEnabled={submitButtonEnabled()}
          onPress={ () => console.log('doing something') }
          backgroundColors={[DYNAMIC.primary, DYNAMIC.link]}
          borderColors={[DYNAMIC.white, DYNAMIC.link]}
          textColors={[DYNAMIC.white, DYNAMIC.black]}
        />
      </View>
    )
  }

  render() {
    return (
      <PressCapture onPress={this.handleCapture}>
        <View style={[common.staticView, {justifyContent: 'flex-start', backgroundColor: DYNAMIC.primary}]}>
          { this.renderLogo() }
          { this.renderInputs() }
          { this.renderAuthButtons() }
          { this.renderToggleLink() }
        </View>
      </PressCapture>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    user: state.users.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatchLogin: user => {
      dispatch(login(user))
    },
    addUser: (user) => {
      dispatch(UserActions.addUser(user))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)

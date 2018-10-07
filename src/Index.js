import React, { Component } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { TabNavigator } from 'react-navigation'
import { Provider, connect } from 'react-redux'
import Navigator from './Navigator'
import store from './redux/store'
import LoginScreen from './components/LoginScreen'
import DemoScreen from './components/DemoScreen'
import Toast from './components/reusable/toast'
import { Font } from 'expo'

import { addWorkoutSuccess, removeWorkoutSuccess, recievedWorkouts, updateWorkoutSuccess } from './redux/actions/workoutActions'
import { addSessionSuccess, removeSessionSuccess, recievedSessions, updateSessionSuccess } from './redux/actions/sessionActions'
import { addNotificationSuccess, removeNotificationSuccess, recievedNotifications, updateNotificationSuccess } from './redux/actions/notificationActions'
import * as UserActions from './redux/actions/userActions'
import { rootRef } from './firebase.js'

import Config from 'react-native-config'
import config from '../config'

INDEX_STATE = {
  fontLoaded: false
}

function addListeners(userID) {
  console.log('ADDING LISTENERS', userID)
  // WORKOUTS
  const workoutsRef = rootRef.child('workouts').orderByChild('userID').equalTo(userID)
  workoutsRef.on('child_added', (snapshot) => {
    store.dispatch(addWorkoutSuccess(snapshot.val()))
  })
  workoutsRef.on('child_removed', (snapshot) => {
    store.dispatch(removeWorkoutSuccess(snapshot.val()))
  })
  workoutsRef.on('child_changed', (snapshot) => {
    store.dispatch(updateWorkoutSuccess(snapshot.val()))
  })
  workoutsRef.once('value', (snapshot) => {
    store.dispatch(recievedWorkouts(snapshot.val()))
  })
  //SESSIONS
  const sessionsRef = rootRef.child('sessions').orderByChild('userID').equalTo(userID)
  sessionsRef.on('child_added', (snapshot) => {
    store.dispatch(addSessionSuccess(snapshot.val()))
  })
  sessionsRef.on('child_removed', (snapshot) => {
    store.dispatch(removeSessionSuccess(snapshot.val()))
  })
  sessionsRef.on('child_changed', (snapshot) => {
    store.dispatch(updateSessionSuccess(snapshot.val()))
  })
  sessionsRef.once('value', (snapshot) => {
    store.dispatch(recievedSessions(snapshot.val()))
  })
  // NOTIFICATIONS
  const notificationsRef = rootRef.child(`notifications`).orderByChild('userID').equalTo(userID)
  notificationsRef.on('child_added', (snapshot) => {
    store.dispatch(addNotificationSuccess(snapshot.val()))
  })
  notificationsRef.on('child_removed', (snapshot) => {
    store.dispatch(removeNotificationSuccess(snapshot.val()))
  })
  notificationsRef.on('child_changed', (snapshot) => {
    store.dispatch(updateNotificationSuccess(snapshot.val()))
  })
  notificationsRef.once('value', (snapshot) => {
    store.dispatch(recievedNotifications(snapshot.val()))
  })
  // USERS
  const usersRef = rootRef.child('users').orderByChild('userID').equalTo(userID)
  usersRef.on('child_added', (snapshot) => {
    store.dispatch(UserActions.addUserSuccess(snapshot.val()))
  })
  usersRef.on('child_changed', (snapshot) => {
    store.dispatch(UserActions.updateUserSuccess(snapshot.val()))
  })
  usersRef.once('value', (snapshot) => {
    store.dispatch(UserActions.recievedUser(snapshot.val()))
  })
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = INDEX_STATE
  }

  render() {
    // UNCOMMENT TO WORK ON DEMO
    // if (this.state.fontLoaded) {
    //   return (
    //     <Provider store={store}>
    //       <DemoScreen />
    //     </Provider>
    //   )
    // } else {
    //   return null
    // }

    if (this.state.fontLoaded && this.props.isLoggedIn) {
      return (
        <Provider store={store}>
          <Navigator />
        </Provider>
      )
    } else if (this.state.fontLoaded) {
      return (
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      )
    } else {
      return null
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.user.userID && this.props.user.userID) {
      addListeners(this.props.user.userID)
    }
  }

  async componentDidMount() {
    await Font.loadAsync({
      'raleway-bold': require('../assets/fonts/Raleway-Bold.ttf'),
      'rubik-medium': require('../assets/fonts/Rubik-Medium.ttf'),
      'tajawal3': require('../assets/fonts/tajawal/tajawal3.ttf'),
      'tajawal5': require('../assets/fonts/tajawal/tajawal5.ttf'),
      'roboto-medium': require('../assets/fonts/Roboto/Roboto-Medium.ttf'),
    })
    this.setState({
      fontLoaded: true
    })
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user
  }
}

export default connect(mapStateToProps)(Index)

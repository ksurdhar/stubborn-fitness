import { rootRef } from '../../firebase';

export function recievedNotifications(notifications) {
  return {
    type: 'RECIEVED_NOTIFICATIONS',
    notifications: notifications
  }
}

export function addNotification(notificationObj) {
  const id = Math.random().toString(36).substring(7)
  const notificationRef = rootRef.child(`notifications/${notificationObj.workoutID}`)

  const notification = Object.assign({}, notificationObj, {id})

  notificationRef.set(notification)

  return {
    type: 'ADD_NOTIFICATION'
  }
}

export function updateNotification(workoutID, patchObj) {
  const notificationRef = rootRef.child(`notifications/${workoutID}`)

  notificationRef.update(patchObj)

  return {
    type: 'UPDATE_NOTIFICATION'
  }
}

export function removeNotification(workoutID) {
  const notificationRef = rootRef.child(`notifications/${workoutID}`)
  notificationRef.remove()

  return {
    type: 'REMOVE_NOTIFICATION'
  }
}

export function updateNotificationSuccess(notification) {
  return {
    type: 'UPDATE_NOTIFICATION_SUCCESS',
    notification: notification
  }
}

export function removeNotificationSuccess(notification) {
  return {
    type: 'REMOVE_NOTIFICATION_SUCCESS',
    notification: notification
  }
}

export function addNotificationSuccess(notification) {
  return {
    type: 'ADD_NOTIFICATION_SUCCESS',
    notification: notification
  };
}

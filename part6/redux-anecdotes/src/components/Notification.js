import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as notificationActions from '../reducers/notificationReducer'

const Notification = () => {
  const dispatch = useDispatch()
  const notification = useSelector(state => state.notification)

  if (!notification.text) {
    return null
  }

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  setInterval(() => {
    dispatch(notificationActions.hide(notification.text))
  }, 5000)

  return (
    <div style={style}>
      {notification.text}
    </div>
  )
}

export default Notification
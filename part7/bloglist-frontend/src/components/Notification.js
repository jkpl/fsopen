import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (!notification.text) {
    return null
  }

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    borderColor: notification.type === 'error' ? 'red' : 'black'
  }

  return (
    <div style={style}>
      {notification.text}
    </div>
  )
}

export default Notification
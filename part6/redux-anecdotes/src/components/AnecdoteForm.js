import React from 'react'
import { connect } from 'react-redux'
import * as anecdoteActions from '../reducers/anecdoteReducer'
import * as notificationActions from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
  const createAnecdote = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    e.target.anecdote.value = ''
    props.createAnecdote(content)
    props.showNotification(`you created "${content}"`, 5)
  }

  return (
    <form onSubmit={createAnecdote}>
      <div><input name="anecdote"/></div>
      <button type="submit">create</button>
    </form>
  )
}

export default connect(
  null,
  {
    createAnecdote: anecdoteActions.create,
    showNotification: notificationActions.show,
  }
)(AnecdoteForm)

import React from 'react'
import { useDispatch } from 'react-redux'
import * as anecdoteReducer from '../reducers/anecdoteReducer'
import * as notificationReducer from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const createAnecdote = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    e.target.anecdote.value = ''
    dispatch(anecdoteReducer.create(content))
    dispatch(notificationReducer.show(`you created "${content}"`))
  }

  return (
    <form onSubmit={createAnecdote}>
      <div><input name="anecdote"/></div>
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm

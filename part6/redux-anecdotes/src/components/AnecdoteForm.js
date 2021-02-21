import React from 'react'
import { useDispatch } from 'react-redux'
import anecdotesService from '../services/anecdotes'
import * as anecdoteReducer from '../reducers/anecdoteReducer'
import * as notificationActions from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const createAnecdote = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    e.target.anecdote.value = ''
    const anecdote = await anecdotesService.create(content)
    dispatch(anecdoteReducer.create(anecdote))
    dispatch(notificationActions.show(`you created "${content}"`))
  }

  return (
    <form onSubmit={createAnecdote}>
      <div><input name="anecdote"/></div>
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm

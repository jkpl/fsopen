import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as anecdoteActions from '../reducers/anecdoteReducer'
import * as notificationActions from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdote)
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(anecdoteActions.vote(anecdote.id))
    dispatch(notificationActions.show(`you voted "${anecdote.content}"`))
  }

  return anecdotes.map(anecdote =>
    <div key={anecdote.id}>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={() => vote(anecdote)}>vote</button>
      </div>
    </div>
  )
}

export default AnecdoteList

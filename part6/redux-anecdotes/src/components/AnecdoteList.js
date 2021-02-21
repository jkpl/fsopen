import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as anecdoteReducer from '../reducers/anecdoteReducer'
import * as notificationReducer from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdote)
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(anecdoteReducer.vote(anecdote.id))
    dispatch(notificationReducer.show(`you voted "${anecdote.content}"`))
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

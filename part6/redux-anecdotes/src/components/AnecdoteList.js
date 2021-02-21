import React from 'react'
import { connect } from 'react-redux'
import * as anecdoteActions from '../reducers/anecdoteReducer'
import * as notificationActions from '../reducers/notificationReducer'

const AnecdoteList = (props) => {
  const vote = (anecdote) => {
    props.voteAnecdote(anecdote)
    props.showNotification(`you voted "${anecdote.content}"`, 10)
  }

  return props.anecdotes.map(anecdote =>
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

export default connect(
  (state) => {
    return {
      anecdotes: state.anecdote
    }
  },
  {
    voteAnecdote: anecdoteActions.vote,
    showNotification: notificationActions.show,
  }
)(AnecdoteList)

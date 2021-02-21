const anecdotesAtStart = []

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

export const initialize = (anecdotes) => {
  return {
    type: 'INIT_ANECDOTES',
    data: { anecdotes }
  }
}

export const vote = (id) => {
  return {
    type: 'VOTE_ANECDOTE',
    data: { id }
  }
}

export const create = (anecdote) => {
  return {
    type: 'CREATE_ANECDOTE',
    data: { anecdote }
  }
}

const handleAction = (state, action) => {
  switch (action.type) {
    case 'INIT_ANECDOTES':
      return action.data.anecdotes
    case 'VOTE_ANECDOTE':
      return state.map(
        (anecdote) =>
          anecdote.id === action.data.id
          ? {...anecdote, votes: anecdote.votes + 1}
          : anecdote
      )
    case 'CREATE_ANECDOTE':
      return [...state, action.data.anecdote]
    default:
      return state
  }
}

const reducer = (state = initialState, action) => {
  return handleAction(state, action).sort((a, b) => b.votes - a.votes)
}

export default reducer
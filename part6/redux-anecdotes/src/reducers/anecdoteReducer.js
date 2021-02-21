import anecdotesService from '../services/anecdotes'

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

export const initialize = () => {
  return async (dispatch) => {
    const anecdotes = await anecdotesService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: { anecdotes }
    })
  }
}

export const vote = (anecdote) => {
  return async (dispatch) => {
    const newAnecdote = {...anecdote, votes: anecdote.votes + 1}
    await anecdotesService.update(newAnecdote)
    dispatch({
      type: 'VOTE_ANECDOTE',
      data: { anecdote: newAnecdote }
    })
  }
}

export const create = (content) => {
  return async (dispatch) => {
    const anecdote = await anecdotesService.create({content, votes: 0})
    dispatch({
      type: 'CREATE_ANECDOTE',
      data: { anecdote }
    })
  }
}

const handleAction = (state, action) => {
  switch (action.type) {
    case 'INIT_ANECDOTES':
      return action.data.anecdotes
    case 'VOTE_ANECDOTE':
      return state.map(
        (anecdote) =>
          anecdote.id === action.data.anecdote.id
          ? action.data.anecdote
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
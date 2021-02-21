import { createStore, combineReducers } from 'redux'
import notificationReducer from './reducers/notificationReducer'
import anecdoteReducer from './reducers/anecdoteReducer'
import * as anecdoteActions from './reducers/anecdoteReducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import anecdotesService from './services/anecdotes'

const reducer = combineReducers({
  anecdote: anecdoteReducer,
  notification: notificationReducer
})

const store = createStore(
  reducer,
  composeWithDevTools()
)

anecdotesService.getAll().then((anecdotes) => {
  store.dispatch(anecdoteActions.initialize(anecdotes))
})

export default store
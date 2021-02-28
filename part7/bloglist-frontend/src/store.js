import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import userReducer from './reducers/user'
import bloglistReducer from './reducers/bloglist'
import notificationReducer from './reducers/notification'
import { composeWithDevTools } from 'redux-devtools-extension'

const reducer = combineReducers({
  user: userReducer,
  bloglist: bloglistReducer,
  notification: notificationReducer,
})

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk))
)

export default store

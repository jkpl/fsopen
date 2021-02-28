import loginService from '../services/login'
import * as blogActions from './blogs'
import * as notificationActions from './notification'

const initialState = null

export const loadLocalStorage = () => {
  return async (dispatch, getState) => {
    if (getState().user !== null) {
      return
    }

    const loggedUserDetailsJson = window.localStorage.getItem('loggedUserDetails')
    if (loggedUserDetailsJson) {
      const user = JSON.parse(loggedUserDetailsJson)
      dispatch({
        type: 'SET_USER',
        data: { user }
      })
      dispatch(blogActions.setRequestConfig(user))
    }
  }
}

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(username, password)
      window.localStorage.setItem('loggedUserDetails', JSON.stringify(user))
      console.log(user)
      dispatch({
        type: 'SET_USER',
        data: { user }
      })
      dispatch(blogActions.setRequestConfig(user))
    } catch (e) {
      dispatch(notificationActions.show(`login failed for user '${username}'`))
    }
  }
}

export const logout = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedUserDetails')
    dispatch(blogActions.setRequestConfig(null))
    dispatch({
      type: 'UNSET_USER',
    })
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {...action.data.user}
    case 'UNSET_USER':
      return null
    default:
      return state
  }
}

export default reducer

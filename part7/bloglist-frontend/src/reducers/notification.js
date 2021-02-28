const initialState = {
  text: '',
}

export const show = (text, type, timeoutSeconds = 5) => {
  return async (dispatch) => {
    dispatch({
      type: 'SHOW_NOTIFICATION',
      data: { text, type }
    })
    setInterval(() => {
      dispatch({
        type: 'HIDE_NOTIFICATION',
        data: { text, type }
      })
    }, timeoutSeconds * 1000)
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return { text: action.data.text, type: action.data.type }
    case 'HIDE_NOTIFICATION':
      // make sure we don't hide notifications prematurely
      if (state.text === action.data.text) {
        return initialState
      }
      return state
    default:
      return state
  }
}

export default reducer

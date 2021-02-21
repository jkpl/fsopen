const initialState = {
  text: '',
}

export const show = (text) => {
  return {
    type: 'SHOW_NOTIFICATION',
    data: { text }
  }
}

export const hide = (text) => {
  return {
    type: 'HIDE_NOTIFICATION',
    data: { text }
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return { text: action.data.text }
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
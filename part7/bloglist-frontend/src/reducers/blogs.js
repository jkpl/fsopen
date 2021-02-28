import * as notificationActions from './notification'
import blogsService from '../services/blogs'

const initialState = {
  requestConfig: null,
  blogs: [],
}

function reqConfig(user) {
  if (user === null) {
    return null
  }
  return {
    headers: {
      Authorization: `bearer ${user.token}`
    }
  }
}

export const setRequestConfig = (user) => {
  return {
    type: 'SET_REQUEST_CONFIG',
    data: { requestConfig: reqConfig(user) }
  }
}

export const initialize = () => {
  return async (dispatch, getState) => {
    const { requestConfig } = getState().blogs

    try {
      const blogs = await blogsService.getAll(requestConfig)
      dispatch({
        type: 'INIT_BLOGS',
        data: { blogs }
      })
    } catch (e) {
      dispatch(notificationActions.show(`failed to fetch blogs: ${e.message}`, 'error'))
    }
  }
}

export const like = (blog) => {
  return async (dispatch, getState) => {
    const { requestConfig } = getState().blogs
    const newBlog = {...blog, likes: blog.likes + 1}

    try {
      await blogsService.update(newBlog, requestConfig)
      dispatch({
        type: 'LIKE_BLOG',
        data: { blog: newBlog }
      })
      dispatch(notificationActions.show(`liked blog '${blog.title}'`))
    } catch (e) {
      dispatch(notificationActions.show(`failed to like blog: ${e.message}`, 'error'))
    }
  }
}

export const create = (blogData) => {
  return async (dispatch, getState) => {
    const { requestConfig } = getState().blogs

    try {
      const blog = await blogsService.create(blogData, requestConfig)
      dispatch({
        type: 'CREATE_BLOG',
        data: { blog }
      })
      dispatch(notificationActions.show(`created blog entry '${blog.title}'`))
    } catch (e) {
      dispatch(notificationActions.show(`failed to create blog: ${e.message}`, 'error'))
    }
  }
}

export const remove = (blog) => {
  return async (dispatch, getState) => {
    const { requestConfig } = getState().blogs

    try {
      await blogsService.remove(blog.id, requestConfig)
      dispatch({
        type: 'REMOVE_BLOG',
        data: { blog }
      })
      dispatch(notificationActions.show(`deleted blog entry '${blog.title}'`))
    } catch (e) {
      dispatch(notificationActions.show(`failed to delete blog: ${e.message}`, 'error'))
    }
  }
}

const handleBlogActions = (blogs, action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.data.blogs
    case 'LIKE_BLOG':
      return blogs.map(
        (blog) =>
          blog.id === action.data.blog.id
          ? action.data.blog
          : blog
      )
    case 'CREATE_BLOG':
      return [...blogs, action.data.blog]
    case 'REMOVE_BLOG':
      return blogs.filter(
        (blog) => blog.id !== action.data.blog.id
      )
    default:
      return blogs
  }
}

function sortByLikes(bls) {
  return bls.sort((b1, b2) => b2.likes - b1.likes)
}

const reducer = (state = initialState, action) => {
  if (action.type === 'SET_REQUEST_CONFIG') {
    return { ...state, requestConfig: action.data.requestConfig }
  }
  return { ...state, blogs: sortByLikes(handleBlogActions(state.blogs, action)) }
}

export default reducer

import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Notification from './components/Notification'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Login from './components/Login'
import UserDetails from './components/UserDetails'
import Togglable from './components/Togglable'
import * as blogActions from './reducers/blogs'
import * as userActions from './reducers/user'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs.blogs)
  const user = useSelector((state) => state.user)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const noteFormVisibilityRef = useRef()

  const loginState = {
    username,
    setUsername,
    password,
    setPassword,
  }

  useEffect(() => {
    dispatch(userActions.loadLocalStorage())
  }, [dispatch])

  useEffect(() => {
    if (user !== null) {
      dispatch(blogActions.initialize())
    }
  }, [dispatch, user])

  function handleLogin(e) {
    e.preventDefault()
    dispatch(userActions.login(username, password))
    setUsername('')
    setPassword('')
  }

  function handleLogout(e) {
    e.preventDefault()
    dispatch(userActions.logout())
  }

  if (user === null) {
    return (
      <>
        <h2>Log in to the application</h2>
        <Login handleLogin={handleLogin} state={loginState} />
      </>
    )
  }

  return (
    <div>
      <Notification />
      <UserDetails handleLogout={handleLogout} user={user} />
      <Togglable buttonLabel="new blog" ref={noteFormVisibilityRef}>
        <h2>create new</h2>
        <BlogForm />
      </Togglable>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
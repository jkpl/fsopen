import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Login from './components/Login'
import UserDetails from './components/UserDetails'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

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

let requestConfig = null

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const noteFormVisibilityRef = useRef()
  
  const loginState = {
    username,
    setUsername,
    password,
    setPassword,
  }

  if (user === null) {
    const loggedUserDetailsJson = window.localStorage.getItem('loggedUserDetails')
    if (loggedUserDetailsJson) {
      setUser(JSON.parse(loggedUserDetailsJson))
    }
  }
  requestConfig = reqConfig(user)

  async function getAllBlogs(config) {
    const bls = await blogService.getAll(config)
    setBlogs(bls)
  }

  useEffect(() => {
    if (requestConfig) {
      getAllBlogs(requestConfig)
    }
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    const user = await loginService.login(username, password)
    window.localStorage.setItem('loggedUserDetails', JSON.stringify(user))
    setUser(user)
    setUsername('')
    setPassword('')
    await getAllBlogs(requestConfig)
  }

  function handleLogout(e) {
    e.preventDefault()
    window.localStorage.removeItem('loggedUserDetails')
    setUser(null)
  }

  async function handleBlogCreate(blog) {
    await blogService.create(blog, requestConfig)
    setBlogs([...blogs, blog])
    noteFormVisibilityRef.current.toggleVisibility()
    return true
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
      <UserDetails handleLogout={handleLogout} user={user} />
      <Togglable buttonLabel="new note" ref={noteFormVisibilityRef}>
        <h2>create new</h2>
        <BlogForm createBlog={handleBlogCreate} />
      </Togglable>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
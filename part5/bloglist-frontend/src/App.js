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

function sortByLikes(bls) {
  bls.sort((b1, b2) => b2.likes - b1.likes)
  return bls
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
    setBlogs(sortByLikes(bls))
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
    const createdBlog = await blogService.create(blog, requestConfig)
    setBlogs(sortByLikes([...blogs, createdBlog]))
    noteFormVisibilityRef.current.toggleVisibility()
    return true
  }

  async function likeBlog(blogData) {
    const blog = { ...blogData }
    blog.likes = blog.likes + 1
    const updatedBlog = await blogService.update(blog, requestConfig)
    return updatedBlog
  }

  async function removeBlog(blogData) {
    await blogService.remove(blogData.id, requestConfig)
    setBlogs(sortByLikes(blogs.filter((b) => b.id !== blogData.id)))
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
      <Togglable buttonLabel="new blog" ref={noteFormVisibilityRef}>
        <h2>create new</h2>
        <BlogForm createBlog={handleBlogCreate} />
      </Togglable>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blogData={blog} likeAction={likeBlog} removeAction={removeBlog} />
      )}
    </div>
  )
}

export default App
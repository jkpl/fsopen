import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import * as notificationActions from '../reducers/notification'

import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  async function handleBlogCreate(e) {
    e.preventDefault()
    const blog = { title, author, url }
    const success = await createBlog(blog)
    if (success) {
      setTitle('')
      setAuthor('')
      setUrl('')
      dispatch(notificationActions.show(`created entry '${blog.title}'`))
    } else {
      dispatch(notificationActions.show(`failed to create entry '${blog.title}'`, 'error'))
    }
  }

  return (
    <form onSubmit={handleBlogCreate}>
      <div>
        title:
        <input
          type="text"
          value={title}
          name="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          name="Author"
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      <div>
        url:
        <input
          type="url"
          value={url}
          name="URL"
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <button id="submitblog" type="submit">create</button>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm

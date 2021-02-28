import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import * as notificationActions from '../reducers/notification'

const Blog = ({ likeAction, removeAction, blogData }) => {
  const dispatch = useDispatch()
  const [blog, setBlog] = useState(blogData)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  async function handleLikeClick(e) {
    e.preventDefault()
    try {
      const nextBlog = await likeAction(blog)
      setBlog(nextBlog)
    } catch (e) {
      dispatch(notificationActions.show(`failed to like blog: ${e.message}`, 'error'))
    }
  }

  async function handleRemoveClick(e) {
    e.preventDefault()
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      try {
        await removeAction(blog)
      } catch (e) {
        dispatch(notificationActions.show(`failed to delete blog: ${e.message}`, 'error'))
      }
    }
  }

  return (
    <div style={blogStyle} className="blog-entry">
      <div className="blog-info">
        <a href={blog.url}>
        &quot;{blog.title}&quot;
        </a> by {blog.author}
      </div>
      <div className="blog-likes">
        {blog.likes || 0} likes <button onClick={handleLikeClick}>like</button>
      </div>
      <div className="blog-user">
        added by {blog.user.name}
      </div>
      <div className="blog-remove">
        <button onClick={handleRemoveClick}>remove</button>
      </div>
    </div>
  )
}

export default Blog

import React from 'react'
import { useDispatch } from 'react-redux'
import * as blogActions from '../reducers/blogs'

const Blog = ({ blog }) => {
  const dispatch = useDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  async function handleLikeClick(e) {
    e.preventDefault()
    dispatch(blogActions.like(blog))
  }

  async function handleRemoveClick(e) {
    e.preventDefault()
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      dispatch(blogActions.remove(blog))
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

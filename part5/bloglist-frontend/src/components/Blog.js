import React, { useState } from 'react'

const Blog = ({ likeAction, removeAction, blogData }) => {
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
    const nextBlog = await likeAction(blog)
    setBlog(nextBlog)
  }

  async function handleRemoveClick(e) {
    e.preventDefault()
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      removeAction(blog)
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        <a href={blog.url}>
        "{blog.title}"
        </a> by {blog.author}
      </div>
      <div>
        {blog.likes || 0} likes <button onClick={handleLikeClick}>like</button>
      </div>
      <div>
        added by {blog.user.name}
      </div>
      <div>
        <button onClick={handleRemoveClick}>remove</button>
      </div>
    </div>
  )
}

export default Blog

import React, { useState } from 'react'

const Blog = ({ likeAction, blogData }) => {
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
    </div>
  )
}

export default Blog

import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  async function handleBlogCreate(e) {
    e.preventDefault()
    const blog = {title, author, url}
    const success = await createBlog(blog)
    if (success) {
      setTitle('')
      setAuthor('')
      setUrl('')
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
    <button type="submit">create</button>
    </form>
  )
}

export default BlogForm

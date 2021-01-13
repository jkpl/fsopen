import React from 'react'
const BlogForm = ({ handleBlogCreate, state }) => (
  <form onSubmit={handleBlogCreate}>
  <div>
    title:
    <input
      type="text"
      value={state.title}
      name="Title"
      onChange={(e) => state.setTitle(e.target.value)}
    />
  </div>
  <div>
    author:
    <input
      type="author"
      value={state.author}
      name="Author"
      onChange={(e) => state.setAuthor(e.target.value)}
    />
  </div>
  <div>
    url:
    <input
      type="url"
      value={state.url}
      name="URL"
      onChange={(e) => state.setUrl(e.target.value)}
    />
  </div>
  <button type="submit">create</button>
</form>
)

export default BlogForm

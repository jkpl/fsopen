import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Hello world',
    author: 'Timo',
    likes: 10,
    url: 'http://example.org'
  }
  let component

  beforeEach(() => {
    component = render(
      <Blog blog={blog} />
    )
  })

  test('shows title and author', () => {
    expect(component.container).toHaveTextContent(blog.title)
    expect(component.container).toHaveTextContent(blog.author)
  })

  test('doesn\'t show url or likes by default', () => {
    expect(component.container).not.toHaveTextContent(blog.likes)
    expect(component.container).not.toHaveTextContent(blog.url)
  })
})

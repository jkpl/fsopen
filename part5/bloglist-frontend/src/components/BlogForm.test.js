import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('submitting the form should produce the expected data', () => {
    const blogData = {
      title: 'Hello world',
      author: 'Pasi',
      url: 'http://example.org/'
    }
    const createBlogMock = jest.fn()

    const component = render(
      <BlogForm createBlog={createBlogMock} />
    )

    // fill in the data
    const setFormValue = (name, value) => {
      fireEvent.change(
        component.container.querySelector(`[name="${name}"]`),
        { target: { value: value } }
      )
    }
    setFormValue('Title', blogData.title)
    setFormValue('Author', blogData.author)
    setFormValue('URL', blogData.url)

    // submit
    fireEvent.submit(component.container.querySelector('form'))

    // called only once
    expect(createBlogMock.mock.calls).toHaveLength(1)

    // blog data is provided
    expect(createBlogMock.mock.calls[0][0]).toEqual(blogData)
  })
})

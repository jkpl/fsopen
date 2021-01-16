describe('Blog app', function() {
  const user = {
    username: 'timo',
    name: 'Timo Simo',
    password: 'tim0',
  }
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to the application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('[name="Username"]').type(user.username)
      cy.get('[name="Password"]').type(user.password)
      cy.get('#loginsubmit').click()

      cy.contains(user.name)
      cy.contains('new blog')
    })

    it('fails with wrong credentials', function() {
      cy.get('[name="Username"]').type(user.username)
      cy.get('[name="Password"]').type(user.password + '!!')
      cy.get('#loginsubmit').click()

      // Login screen is still visible
      cy.contains('Log in to the application')
      cy.contains('username')
      cy.contains('password')
    })
  })

  describe.only('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3001/api/login', user)
        .then((response) => {
          localStorage.setItem('loggedUserDetails', JSON.stringify(response.body))
          cy.visit('http://localhost:3000')
        })
    })

    it('A blog can be created', function() {
      const blogData = {
        title: 'Hello world',
        author: 'Pasi',
        url: 'http://example.org/'
      }

      cy.contains('new blog').click()
      cy.get('[name="Title"]').type(blogData.title)
      cy.get('[name="Author"]').type(blogData.author)
      cy.get('[name="URL"]').type(blogData.url)
      cy.get('#submitblog').click()

      cy.contains(blogData.title)
      cy.contains(blogData.author)
    })
  })
})

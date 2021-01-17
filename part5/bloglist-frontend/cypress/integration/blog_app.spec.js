Cypress.Commands.add('login', (user) => {
  cy.request('POST', 'http://localhost:3001/api/login', user)
    .then((response) => {
      localStorage.setItem('loggedUserDetails', JSON.stringify(response.body))
      cy.visit('http://localhost:3000')
    })
})

Cypress.Commands.add('createBlog', (blog) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3001/api/blogs',
    body: blog,
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedUserDetails')).token}`
    },
  }).then(() => {
    cy.visit('http://localhost:3000')
  })
})

describe('Blog app', function() {
  const user = {
    username: 'timo',
    name: 'Timo',
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

  describe('When logged in', function() {
    const blogData = [
      {
        title: 'Hello world',
        author: 'Simo',
        url: 'http://example.org/',
        likes: 4,
      },
      {
        title: 'Goodbye world',
        author: 'Ismo',
        url: 'http://example.com/',
        likes: 8
      },
      {
        title: 'Example',
        author: 'Pekka',
        url: 'http://example.net',
        likes: 6,
      }
    ]

    beforeEach(function() {
      cy.login(user)
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('[name="Title"]').type(blogData[0].title)
      cy.get('[name="Author"]').type(blogData[0].author)
      cy.get('[name="URL"]').type(blogData[0].url)
      cy.get('#submitblog').click()

      cy.contains(blogData[0].title)
      cy.contains(blogData[0].author)
      cy.contains('0 likes')
    })

    describe('When blogs have been created', function() {
      beforeEach(function() {
        blogData.forEach((b) => cy.createBlog(b))
      })

      function findBlogEntry(title) {
        return cy.contains(title).parent().parent('.blog-entry')
      }

      it('A blog can be liked', function() {
        findBlogEntry(blogData[0].title).contains('like').click()
        findBlogEntry(blogData[0].title).contains('5 likes')

        findBlogEntry(blogData[0].title).contains('like').click()
        findBlogEntry(blogData[0].title).contains('6 likes')
      })

      it('A blog can be removed', function() {
        cy.on('window:confirm', () => true)

        findBlogEntry(blogData[0].title).contains('remove').click()

        cy.contains(blogData[0].title).should('not.exist')
        cy.contains(blogData[0].author).should('not.exist')
      })

      it('Blogs are sorted by likes', function() {
        cy.get('.blog-likes').then((blogElements) => {
          const likesInPage = blogElements.map(
            (i, el) => Number.parseInt(el.textContent.split(' ')[0], 10)
          ).get()

          const likesSorted = [... likesInPage ]
          likesSorted.sort()
          likesSorted.reverse()

          expect(likesInPage).to.eql(likesSorted)
        })
      })
    })
  })
})

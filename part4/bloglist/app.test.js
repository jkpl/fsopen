require('dotenv').config();
const mongo = require('./mongo');
const app = require('./app');
const Blog = require('./models/blog');
const User = require('./models/user');
const supertest = require('supertest');

// Initial data
const initialUsers = [
  {
    _id: "5a422a851b54a676234d17f7",
    username: "seppo",
    passwordHash: "$2b$10$lyyzzeOhSTSYDhZuqYXe1O2rxclShbX.USaT4swsUjdGVCs7wM3JC", // = sepp0
    name: "Seppo"
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    username: "pasi",
    passwordHash: "$2b$10$lyyzzeOhSTSYDhZuqYXe1O2rxclShbX.USaT4swsUjdGVCs7wM3JC", // = sepp0
    name: "Pasi"
  }
]
const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: "5a422a851b54a676234d17f7",
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    user: "5a422a851b54a676234d17f7",
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    user: "5a422aa71b54a676234d17f8",
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    user: "5a422a851b54a676234d17f7",
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    user: "5a422aa71b54a676234d17f8",
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    user: "5a422a851b54a676234d17f7",
    __v: 0
  }
];

// Mongo setup
const MONGODB_URI = process.env.TEST_MONGODB_URI;
mongo.connect(MONGODB_URI);

// API setup
const api = supertest(app);

// Test setup

afterAll(() => {
  mongo.disconnect();
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  await Promise.all(initialBlogs.map(
    (blog) => (new Blog(blog)).save()
  ));
  await Promise.all(initialUsers.map(
    (user) => (new User(user)).save()
  ));
});

async function login() {
  const response = await api
    .post('/api/login')
    .send({username: "seppo", password: "sepp0"})
    .expect(200)
    .expect('Content-Type', /application\/json/);
  return response.body.token;
}

function headers(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  }
}

describe('blogs list API', () => {
  test('contains the initial blog data', async () => {
    const token = await login();

    const response = await api
      .get('/api/blogs')
      .set(headers(token))
      .expect(200)
      .expect('Content-Type', /application\/json/);
    
    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test('finds new entries', async () => {
    const token = await login();

    const newBlog = {
      title: 'Practical Monitoring',
      author: 'Mike Julian',
      url: 'http://www.practicalmonitoring.com/',
      likes: 1,
    };
    await api
      .post('/api/blogs')
      .set(headers(token))
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    
    // check that the new blog post is found from the list
    const response = await api.get('/api/blogs').set(headers(token));
    expect(response.body).toHaveLength(initialBlogs.length + 1);
    const content = response.body.map((blog) => {
      return {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes,
      }
    });
    expect(content).toContainEqual(newBlog);

    // check user details
    const newBlogFromServer = response.body.find((blog) => blog.title === newBlog.title);
    expect(newBlogFromServer.user).toEqual({
      id: "5a422a851b54a676234d17f7",
      username: "seppo",
      name: "Seppo"
    })
  });

  test('deletes initial entries', async () => {
    const token = await login();

    await api
      .delete('/api/blogs/' + initialBlogs[0]._id)
      .set(headers(token))
      .expect(204);

    const response = await api.get('/api/blogs').set(headers(token));
    expect(response.body).toHaveLength(initialBlogs.length - 1);
  });

  test('deletes for different users are not allowed', async () => {
    const token = await login();

    await api
      .delete('/api/blogs/' + initialBlogs[2]._id)
      .set(headers(token))
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });

  test('updates likes', async () => {
    const token = await login();

    const blogUpdate = {...initialBlogs[1], likes: 10};
    await api
      .put('/api/blogs/' + blogUpdate._id)
      .set(headers(token))
      .send(blogUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    
    const response = await api.get('/api/blogs').set(headers(token));
    expect(response.body).toHaveLength(initialBlogs.length);
    const updatedBlog = response.body.find((blog) => blog.id === blogUpdate._id);
    expect(updatedBlog.likes).toEqual(blogUpdate.likes);
  });
});

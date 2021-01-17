const router = require('express').Router();
const Blog = require('./models/blog');

function blogFromBody(body) {
  return {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  };
}

router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.json(blogs.map((b) => b.toJSON()));
});

router.post('/', async (request, response) => {
  const blog = new Blog({...blogFromBody(request.body), user: request.user.id});
  const result = await blog.save();
  const resultWithUser = await result.populate('user').execPopulate()
  response.status(201).json(resultWithUser.toJSON());
});

router.delete('/:id', async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id);
  if (blogToDelete.user.toString() === request.user.id) {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } else {
    response.status(401).json({error: 'Deletion of other\'s blogs is not allowed.'})
  }
});

router.put('/:id', async (request, response) => {
  const blog = blogFromBody(request.body);
  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true })
    .populate('user')
  response.json(updatedBlog.toJSON());
});

module.exports = router;
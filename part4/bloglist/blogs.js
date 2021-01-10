const router = require('express').Router();
const Blog = require('./models/blog');
const User = require('./models/user');

router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.json(blogs);
});

router.post('/', async (request, response) => {
  const blog = new Blog({...request.body, user: request.user.id});
  const result = await blog.save();
  response.status(201).json(result);
});

router.delete('/:id', async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id);
  if (blogToDelete.user.toString() === request.user.id) {
    const result = await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();  
  } else {
    response.status(401).json({error: 'Deletion of other\'s blogs is not allowed.'})
  }
});

router.put('/:id', async (request, response) => {
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog);
});

module.exports = router;
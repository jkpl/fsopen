function dummy(blogs) {
  return 1;
}

function totalLikes(blogs) {
  return blogs.reduce(
    (acc, next) => acc + (next.likes || 0),
    0
  );
}

function favoriteBlog(blogs) {
  if (blogs.length == 0) {
    return null;
  }
  return blogs.reduce(
    (prev, next) => (prev.likes || 0) < (next.likes) ? next : prev
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};

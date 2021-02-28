import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async (config) => {
  const response = await axios.get(baseUrl, config)
  return response.data
}

const create = async (blog, config) => {
  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const update = async (blog, config) => {
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog, config)
  return response.data
}

const remove = async (blogId, config) => {
  await axios.delete(`${baseUrl}/${blogId}`, config)
}

export default { getAll, create, update, remove }

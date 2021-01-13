import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async (config) => {
  const response = await axios.get(baseUrl, config)
  return response.data
}

const create = async (blog, config) => {
  await axios.post(baseUrl, blog, config)
}

export default { getAll, create }
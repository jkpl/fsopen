import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const create = async (anecdote) => {
  const response = await axios.post(baseUrl, anecdote)
  return response.data
}

const update = async (anecdote) => {
  const response = await axios.put(`${baseUrl}/${anecdote.id}`, anecdote)
  return response
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { create, update, getAll }

import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const create = async (content) => {
  const anecdote = {
    votes: 0,
    content,
  }
  const response = await axios.post(baseUrl, anecdote)
  return response.data
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { create, getAll }

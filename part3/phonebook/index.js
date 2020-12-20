const generateId = require('./genid');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 3001;

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
];

app.use(express.json());
app.use(express.static('build'))
app.use(cors());
app.use(morgan('tiny'));

app.get('/info', (request, response) => {
  const timestamp = new Date();
  const content = `Phonebook has info for ${persons.length} people

${timestamp.toDateString()} ${timestamp.toTimeString()}`;
  response.send(content);
});

app.get('/api/persons', (request, response) => {
  response.json(persons)
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id.toString() === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id.toString() !== id);
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const person = {...request.body, id: generateId()};
  if (!person.name) {
    response.status(400).json({error: 'missing name field'});
    return;
  }
  if (!person.number) {
    response.status(400).json({error: 'missing number field'});
    return;
  }
  if (persons.find((p) => p.name === person.name)) {
    response.status(400).json({error: 'name must be unique'});
    return;
  }

  persons.push(person);
  response.json(person);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

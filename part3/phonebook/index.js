require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Person = require('./models/person');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('build'))
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.get('/info', (request, response, next) => {
  const timestamp = new Date();
  Person.find({}).then((persons) => {
    const content = `Phonebook has info for ${persons.length} people

${timestamp.toDateString()} ${timestamp.toTimeString()}`;
    response.send(content);
  }).catch((err) => next(err));
});

app.get('/api/persons', (request, response, next) => {
  Person
    .find({})
    .then((persons) => response.json(persons))
    .catch((err) => next(err));
});

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)        
      } else {
        response.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then((result) => response.status(204).end())
    .catch((err) => next(err));
});

app.post('/api/persons', (request, response, next) => {
  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  });

  person
    .save()
    .then((savedPerson) => response.json(savedPerson))
    .catch((err) => next(err))
});

app.put('/api/persons/:id', (request, response, next) => {
  const person = {
    name: request.body.name,
    number: request.body.number,
  };
  
  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => response.json(updatedPerson))
    .catch(err => next(err));
});

function unknownEndpoint(request, response) {
  response.status(404).send({ error: 'unknown endpoint' });
}
app.use(unknownEndpoint);

function errorHandler(err, request, response, next) {
  console.error(`${err.name}: ${err.message}`);

  if (err.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (err.name === 'ValidationError') {
    return response.status(400).json({ error: err.message });
  }

  next(err);
}
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

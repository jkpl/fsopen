const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password> <name> <number>');
  process.exit(1);
}

const [password, personName, personNumber] = process.argv.slice(2);
const url = `mongodb+srv://phonebook:${password}@cluster0.g6s5j.mongodb.net/phonebook?retryWrites=true`;

mongoose.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true },
);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (personName) {
  const person = new Person({
    name: personName,
    number: personNumber,
  });
  
  person.save().then(result => {
    console.log(`added ${personName} number ${personNumber} to phonebook`);
    mongoose.connection.close();
  });  
} else {
  Person.find({}).then((persons) => {
    console.log('phonebook:')
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}

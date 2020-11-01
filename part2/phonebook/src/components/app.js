import React, { useState, useEffect } from 'react';
import phonebook from '../services/phonebook';

const Notification = ({notification}) => {
  if (!notification || !notification.message) {
    return <></>;
  }
  const cssClassName = `notification notification-${notification.status}`;
  return (
    <div className={cssClassName}>
      {notification.message}
    </div>
  );
};

const Filter = ({value, setValue}) => {
  function handleNameFilterChange(event) {
    setValue(event.target.value);
  }
  return (
    <div>
      filter shown with <input value={value} onChange={handleNameFilterChange} />
    </div>
  );
};

const PersonForm = ({submit, nameValue, setName, numberValue, setNumber}) => {
  function onSubmit(event) {
    event.preventDefault();
    submit({
      name: nameValue,
      number: numberValue,
    });
  }

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleNumberChange(event) {
    setNumber(event.target.value);
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={nameValue} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={numberValue} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Person = ({person, onDelete}) => {
  function deleteAction() {
    if (window.confirm(`Delete ${person.name} ?`)) {
      onDelete(person);
    }
  }

  return (
    <div>
      {person.name} {person.number} <button onClick={deleteAction}>delete</button>
    </div>
  );
};

const Persons = ({persons, onDelete}) => {
  return persons.map(
    (person) => <Person key={person.id} person={person} onDelete={onDelete} />
  );
};

const App = () => {
  const [ persons, setPersons ] = useState([]);
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ nameFilter, setFilter ] = useState('');
  const [ notification, setNotification ] = useState({});

  const displayedPersons = nameFilter === ''
    ? persons
    : persons.filter(
      ({name}) => name.toLowerCase().includes(nameFilter.toLowerCase())
    );

  function fetchPersons() {
    phonebook.getAll().then(setPersons);
  }
  useEffect(fetchPersons, []);

  function addPhonebookEntry(newPerson) {
    const duplicate = persons.find(({name}) => name === newPerson.name);

    if (duplicate) {
      const confirmText = `${newPerson.name} is already added to phonebook, replace the old number with a new one?`;
      if (window.confirm(confirmText)) {
        phonebook
          .update(duplicate.id, newPerson)
          .then((updatedPerson) => {
            const nextPersons = persons.map(
              (person) => person.id === updatedPerson.id ? updatedPerson : person
            );
            setPersons(nextPersons);
            displayNotification({
              message: `Updated ${updatedPerson.name}`,
              status: 'ok',
            })
          });
      }
    } else {
      phonebook
        .create(newPerson)
        .then((person) => {
          setPersons(persons.concat(person))
          displayNotification({
            message: `Added ${person.name}`,
            status: 'ok',
          })
        });
    }
  }


  function removePersonFromViewById(idToDelete) {
    const nextPersons = persons.filter(({id}) => id !== idToDelete);
    setPersons(nextPersons);
  }

  function deletePerson(person) {
    phonebook
      .deleteById(person.id)
      .then(() => {
        removePersonFromViewById(person.id);
        displayNotification({
          message: `Deleted ${person.name}`,
          status: 'ok',
        })
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          removePersonFromViewById(person.id);
          displayNotification({
            message: `Information of ${person.name} has already been removed from server`,
            status: 'fail',
          })
          return;
        }
        return err;
      });
  }

  function displayNotification(notification) {
    setNotification(notification);
    setTimeout(() => {
      setNotification({});
    }, 5000);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter value={nameFilter} setValue={setFilter} />
      <h3>Add a new</h3>
      <PersonForm
        submit={addPhonebookEntry}
        nameValue={newName}
        setName={setNewName}
        numberValue={newNumber}
        setNumber={setNewNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={displayedPersons} onDelete={deletePerson} />
    </div>
  );
}

export default App;
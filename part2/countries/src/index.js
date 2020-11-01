import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const Countries = ({countries, showCountry}) => {
  if (countries.length === 0) {
    return (<div></div>);
  }
  if (countries.length === 1) {
    return (<Country country={countries[0]}/> );
  }
  if (countries.length > 10) {
    return (<div>Too many matches, specify another filter</div>);
  }
  return countries.map(
    ({name}) =>
      <div key={name}>
        {name}
        <button onClick={() => showCountry(name)}>show</button>
      </div>
  );
};

const Country = ({country}) => {
  return (
    <div>
      <h2>{country.name}</h2>
      <div>capital: {country.capital}</div>
      <div>population: {country.population}</div>
      <h3>Languages</h3>
      <ul>
        {country.languages.map(
          ({name}) => <li key={name}>{name}</li>
        )}
      </ul>
      <img alt={`flag of ${country.name}`} src={country.flag} width="300" />
    </div>
  );
};

const App = () => {
  const [ query, setQuery ] = useState('');
  const [ countries, setCountries ] = useState([]);

  const displayedCountries = query === ''
    ? []
    : countries.filter(
      ({name}) => name.toLowerCase().includes(query.toLowerCase())
    );

  function fetchCountries() {
    axios
      .get(`https://restcountries.eu/rest/v2/all`)
      .then((response) => {
        setCountries(response.data)
      })
  }
  useEffect(fetchCountries, []);

  function showCountry(countryName) {
    setQuery(countryName);
  }

  return (
    <div>
      <div>
        find countries
        <input
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
      </div>
      <Countries countries={displayedCountries} showCountry={showCountry} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Button = (props) => {
  return (
    <button onClick={props.action}>
      {props.text}
    </button>
  );
};

const Statistic = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  );
};

const Statistics = (props) => {
  const { good, neutral, bad } = props;

  if (good === 0 && neutral === 0 && bad === 0) {
    return <p>No feeback given</p>;
  }

  const all = good + neutral + bad;
  const average = (good - bad) / all;
  const positive = (good / all * 100) + ' %';

  return (
    <table>
      <tbody>
      <Statistic text="good" value={good} />
      <Statistic text="neutral" value={neutral} />
      <Statistic text="bad" value={bad} />
      <Statistic text="all" value={all} />
      <Statistic text="average" value={average} />
      <Statistic text="positive" value={positive} />
      </tbody>
    </table>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  
  function incGood() {
    setGood(good + 1);
  }

  function incNeutral() {
    setNeutral(neutral + 1);
  }

  function incBad() {
    setBad(bad + 1);
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" action={incGood} />
      <Button text="neutral" action={incNeutral} />
      <Button text="bad" action={incBad} />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

ReactDOM.render(<App />, 
  document.getElementById('root')
);
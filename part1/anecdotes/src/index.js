import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Anecdote = (props) => {
  return (
    <div>
      <p>{props.anecdote.text}</p>
      <p>has {props.anecdote.votes} votes</p>
    </div>
  );
}

const App = (props) => {
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(props.anecdotes.length).fill(0));
  
  // Calculate anecdote with the most votes
  const best = votes.map(
    (vc, idx) => ({votes: vc, index: idx})
  ).reduce(
    (best, next) => best.votes < next.votes ? next : best
  );

  function getCurrentAnecdote() {
    return {
      text: props.anecdotes[selected],
      votes: votes[selected],
    };
  }

  function getBestAnecdote() {
    return {
      text: props.anecdotes[best.index],
      votes: best.votes,
    }
  }

  function voteAnecdote() {
    const newVotes = [...votes];
    newVotes[selected] += 1;
    setVotes(newVotes);
  }

  function nextAnecdote() {
    const nextAnecdoteIndex = Math.floor(
      Math.random() * Math.floor(props.anecdotes.length)
    );
    setSelected(nextAnecdoteIndex);
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote anecdote={getCurrentAnecdote()} />
      <p>
        <button onClick={voteAnecdote}>
          vote
        </button>
        <button onClick={nextAnecdote}>
          next anecdote
        </button>
      </p>
      <h1>Anecdote with most votes</h1>
      <Anecdote anecdote={getBestAnecdote()} />
    </div>
  );
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
];

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
);
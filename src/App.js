import React from 'react';

function Logo() {
  return <h1>✈️ Far Away</h1>;
}

function Form() {
  return (
    <div className="add-form">
      <h3>What do you need for your 😊 trip</h3>
    </div>
  );
}

function PackingList() {
  return <div className="list">List</div>;
}

function Stats() {
  return (
    <footer>
      <em> 💼 You have x items on your list and already packed X</em>
    </footer>
  );
}

function App() {
  return (
    <div className="app">
      <Logo />
      <Form />
      <PackingList />
      <Stats />
    </div>
  );
}

export default App;

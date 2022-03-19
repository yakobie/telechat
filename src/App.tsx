import React from 'react';

import { Routes, Route, MemoryRouter } from 'react-router-dom';

//local imports
import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';

import './App.css';

function App() {

  return (
      <Routes>
        <Route path="/" element={ <Join /> }/>
        <Route path="/chat" element={ <Chat /> }/>
      </Routes>
  );
}

export default App;

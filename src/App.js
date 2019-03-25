import React, { useReducer } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
//import { yd_connect, db_connect, get_preview, search_mp3 } from './Providers';
import { AudioContext } from './context/AudioContext';
import TracksReducer from './TracksReducer';

import Yandex from './callback/Yandex';
import Dropbox from './callback/Dropbox';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import './App.css';

function App() {
  const initialState = {
    theme: 'day',
    currentTrack: 0,
    link: null,
    loading: true,
    playing: false,
    list: []
  };
  const [state, dispatch] = useReducer(TracksReducer, initialState);
  return (
    <Router>
      <AudioContext.Provider value={{ state, dispatch }}>
        <div className="app">
          <NavBar />
          <Route exact path="/" component={Home} />
          <Route path="/yandex/callback" component={Yandex} />
          <Route path="/dropbox/callback" component={Dropbox} />
        </div>
      </AudioContext.Provider>
    </Router>
  );
}

export default App;

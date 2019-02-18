import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { yd_connect, db_connect, get_preview } from './Providers';
import { PlayerContext } from './context/PlayerContext';

import Yandex from './callback/Yandex';
import Dropbox from './callback/Dropbox';
import Audio from './components/player/Audio';
import './App.css';
import Player from './components/player/Player';

function App() {  
  const state = {
    currentTrack: 0,
    path: null,
    isPlaying: false,
    loading: true,
    currentTime: 0,
    duration: 0
  }
  const [player, setPlayer] = useState(state);
 
  return (
    <Router>   
      <PlayerContext.Provider value={{ player, setPlayer }}>   
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/yandex/callback" component={Yandex} />
          <Route path="/dropbox/callback" component={Dropbox} />
        </div>
      </PlayerContext.Provider>
    </Router>
  );  
}

// ID: 7f12f06a9a954a5d8d16c1d99cae62fa
// Пароль: 41939814a8e34ab480d947399266a71c
// Callback URL: http://localhost:3000/callback
function Home () { 
  const { player, setPlayer } = useContext(PlayerContext);
  const [ items, setItem ] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('db_access_token')) {  
      let itemsList = [];
      db_connect(localStorage.getItem('db_access_token')).then(res => {
        res.data.entries.map(item => {
          if (item['.tag'] === 'file') {   
            itemsList.push({name: item.name, path: item.path_display, provider: 'dropbox'});           
          }
        });          
                
        setItem(itemsList);               
      });
    }
  }, []);
  
  const ydClientId = '7f12f06a9a954a5d8d16c1d99cae62fa';
  const ydRedirectUri = 'http://localhost:3000/yandex/callback';
  const dbRedirectUri = 'http://localhost:3000/dropbox/callback';    
  
  const yd_token = localStorage.getItem('yd_access_token');
  const db_token = localStorage.getItem('db_access_token');
    
  return (
    <div className="App">
      {!yd_token ? <a href={`https://oauth.yandex.ru/authorize?response_type=token&client_id=${ydClientId}&redirect_uri=${ydRedirectUri}`}>Яндекс</a> : null}
      {!db_token ? <a href={`https://www.dropbox.com/oauth2/authorize?client_id=3sf5dug4qbt4hbf&response_type=token&redirect_uri=${dbRedirectUri}`}>Дропбокс</a> : null}
      {items.length ? (
        <div>
          <Player 
            path={items[player.currentTrack].path}
          />
        </div>
      ) : null}        
      
    </div>
  );
  
}

export default App;

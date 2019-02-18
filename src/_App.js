import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { yd_connect, db_connect, get_preview } from './Providers';

import Yandex from './callback/Yandex';
import Dropbox from './callback/Dropbox';
import TrackList from './components/TrackList';
import Player from './components/Player';
import TestPlayer from './components/player/Audio';
import './App.css';

class App extends Component {  
  render() {
    return (
      <Router>      
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/yandex/callback" component={Yandex} />
          <Route path="/dropbox/callback" component={Dropbox} />
        </div>
      </Router>
    );
  }
}

// ID: 7f12f06a9a954a5d8d16c1d99cae62fa
// Пароль: 41939814a8e34ab480d947399266a71c
// Callback URL: http://localhost:3000/callback
class Home extends Component { 
  state = {
    items: [],
    currentTrack: 0,
    dropbox: []
  }

  componentDidMount () {
    if (localStorage.getItem('yd_access_token')) {
      yd_connect(localStorage.getItem('yd_access_token')).then(res => {
        console.log();
        
        let itemsList = [];
        res.data.items.map(item => {
          if (item.mime_type === 'audio/mpeg') {
            itemsList.push({name: item.name, file: item.file, provider: 'yandex'});
          }
        });
        
        this.setState({...this.state.items, items: itemsList }); 
      });
    }  

    if (localStorage.getItem('db_access_token')) {  
      let itemsList = [];
      db_connect(localStorage.getItem('db_access_token')).then(res => {
        res.data.entries.map(item => {
          if (item['.tag'] === 'file') {   
            itemsList.push({name: item.name, file: item.path_display, provider: 'dropbox'});           
          }
        });          
                
        this.setState({ ...this.state.items, items: itemsList });        
      });
    }
    if (this.state.items.length) {
      if (this.state.items[this.state.currentTrack].provider === 'dropbox') {        
        get_preview(this.state.items[this.state.currentTrack].file).then(res => {
          const src = res.data.link;
          
          this.setState({ src });
        });    
      }
      
    }

  }

  onPrevNext() {
    let currentTrack;
    if (this.state.currentTrack - 1 < 0) {
      currentTrack = this.state.items.length - 1;
    }
    else currentTrack = this.state.currentTrack - 1;
    this.setState({ currentTrack });
  }

  onPlayerNext() {
    console.log(this.state.currentTrack);
    
    let currentTrack;
    if (this.state.currentTrack + 1 > this.state.items.length - 1) {
      currentTrack = 0;
    }
    else currentTrack = this.state.currentTrack + 1;
    this.setState({ currentTrack });
  }

  render () {

    const { items, currentTrack } = this.state;
    
    const ydClientId = '7f12f06a9a954a5d8d16c1d99cae62fa';
    const ydRedirectUri = 'http://localhost:3000/yandex/callback';
    const dbRedirectUri = 'http://localhost:3000/dropbox/callback';
    
    
    const yd_token = localStorage.getItem('yd_access_token');
    const db_token = localStorage.getItem('db_access_token');
    
    return(
      <div className="App">
        {!yd_token ? <a href={`https://oauth.yandex.ru/authorize?response_type=token&client_id=${ydClientId}&redirect_uri=${ydRedirectUri}`}>Яндекс</a> : null}
        {!db_token ? <a href={`https://www.dropbox.com/oauth2/authorize?client_id=3sf5dug4qbt4hbf&response_type=token&redirect_uri=${dbRedirectUri}`}>Дропбокс</a> : null}
        {this.state.items.length ? (
          <div>
            <TestPlayer src='https://dl.dropboxusercontent.com/apitl/1/AABhl0-wpSuBiVci2gxpG1zH_WfghknNEEX7FQAFypciKGXnXpxNgUSH7CrjWUZS1GqpNIJt3DBYqKqJ83ZRTw_mbu2hc-yATad9q1zn5VQUTRPkT5TdnNflPW4neS1EGj8FQ8oUq2jv3CeBAZRy4Vu7ZPTLvjL-RKPE4c7mnD0xZXnoVbHOLFxoHyXM8vDgVJyBF3_6h9SkCVI-_rDo93G_3ll-T_cpvKqP1j-9GnQRDS4AB71Y4U1Dv4vXx8r4uS4V1Eg_Pjp4KTwTl3HgQ9OvPT-38EkmDkzNjYkydmB56vSFQeaouiNYQydupFWz9tY' />
            <Player 
              src={items[currentTrack].file}
              name={items[currentTrack].name} 
              currentTrack={currentTrack}
              onNext={this.onPlayerNext.bind(this)}
              onPrev={this.onPrevNext.bind(this)}
            />
            <TrackList items={this.state.items} />
          </div>
        ) : null}        
        
      </div>
    );
  }  
}

export default App;

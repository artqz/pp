import React, { useContext, useEffect } from 'react';
import { search_mp3 } from '../Providers';
import { AudioContext } from '../context/AudioContext';
import TrackList from '../components/trackList/TrackList';
import Audio from '../components/audio/Audio';

function Home () { 
  const {state, dispatch} = useContext(AudioContext);

  useEffect(() => {
    console.log('Player status:');
    if (localStorage.getItem('db_access_token')) {
      console.log('- Dropbox token found!');
      const itemsList = [];
      console.log('- Start searching for tracks...');      
      search_mp3(localStorage.getItem('db_access_token')).then(res => {
        res.data.matches.map(item => {      
          if (item.metadata['.tag'] === 'file') {   
            itemsList.push({
              name: item.metadata.name, 
              path: item.metadata.path_display, 
              provider: 'dropbox',
              playing: false
            });           
          }
          return itemsList;
        });   
        console.log('- Found ' + itemsList.length + ' tracks!'); 
        dispatch({
          type: 'SET_LIST',
          list: itemsList
        });      
      });
    }
  }, []);   
  
  return state.list[state.currentTrack] ? (
    <div>
      <TrackList list={state.list} />      
      <Audio track={state.list[state.currentTrack].path} />
    </div>
  ) : null;
  
}

export default Home;
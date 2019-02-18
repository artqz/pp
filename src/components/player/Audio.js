import React, { useEffect, useState, useRef, useContext } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import { get_preview } from '../../Providers';

const useFetch = (path) => {
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);  
  useEffect(() => {
    setLoading(true);
    get_preview(path).then(res => {
      setLink(res.data.link);
      setLoading(false);
    })
    
  }, [path]);

  return {link, loading};
};

function Audio(props) {
  const { player, setPlayer } = useContext(PlayerContext);
  const {link, loading} = useFetch(props.path);

  const audio = useRef(); 
  console.log(link, loading);
  
  useEffect(() => {
    if (player.isPlaying) {
      const interval = setInterval(() => {  
          setPlayer({
            ...player, 
            currentTime: audio.current.currentTime,
            duration: audio.current.duration
          });        
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [togglePlay]);    
  
  function togglePlay () {   
    player.isPlaying ? audio.current.pause() : audio.current.play();
    setPlayer({...player, isPlaying: !player.isPlaying });  
  }

  function nextTrack () {    
    setPlayer({
      ...player, 
      currentTrack: player.currentTrack + 1,
      currentTime: 0,
      duration: 0,
      loading: false
    });
    
    audio.current.load(); 
    if (!loading) {     
    
      if (player.isPlaying) {
        const playPromise = audio.current.play();
        if (playPromise !== null) {
          playPromise.catch(() => {             
            audio.current.play();
          })
        }  
      }
    }
  }
  function onLoadedData() {
    setPlayer({
      ...player, 
      loading: true
    });
  }
  return (
    <div>

      {player.currentTime} / {player.duration}
      <audio 
        ref={audio}
        src={link}
        onEnded={nextTrack}     
      >
      </audio>
      <button onClick={togglePlay}>{!player.isPlaying ? 'Play' : 'Pause'}</button>
      <button onClick={nextTrack}>Next</button>
    </div>
  );
}

export default Audio;
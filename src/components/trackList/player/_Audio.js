import React, { useEffect, useState, useRef, useContext } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import { get_preview } from '../../Providers';
import ProgressBar from './ProgressBar';
import Controls from './Controls';

import './Player.css';

const useFetch = (path) => {
  const [linkLoading, setLinkLoading] = useState(true);
  const [link, setLink] = useState(null); 
  useEffect(() => {
    console.log(linkLoading);
    get_preview(path).then(res => {
      setLink(res.data.link);
      setLinkLoading(false);
    });    
  }, [path, setLinkLoading, setLink]);

  return { link, linkLoading, setLinkLoading };
};

const useCanPlay = (audio) => {
  const [canPlay, setCanPlay] = useState(false);

  const loadedTrack = () => {    
    setCanPlay(true);
  };

  useEffect(() => { 
    audio.current.addEventListener('canplay', loadedTrack);
    return () => {
      audio.current.removeEventListener('canplay', loadedTrack);
    };
  }, [canPlay, setCanPlay]);

  return { canPlay, setCanPlay };
}


function Audio(props) {
  const { player, setPlayer } = useContext(PlayerContext);
  const { link, linkLoading, setLinkLoading } = useFetch(props.path);
  const audio = useRef();  
  const [ playing, setPlaying ] = useState(false);
  const {
    canPlay, 
    setCanPlay
  } = useCanPlay(audio);

  function togglePlay () {           
    playing ? audio.current.pause() : audio.current.play();
    setPlaying(!playing);     
  }

 

  function nextTrack () {   
    setCanPlay(false);
    setPlayer({...player, currentTrack: player.currentTrack + 1});    
      audio.current.load(); 
      if (canPlay) {        
        if (playing) {
          const playPromise = audio.current.play();
          if (playPromise !== null) {
            playPromise.catch(() => {            
              audio.current.play();
            })
          }  
        }      
    }
  }
  
  return (
    <div className="player">
      <button onClick={togglePlay}>Play</button>
      <button onClick={nextTrack}>Next</button>
      <audio 
        ref={audio}
        src={link} 
        onEnded={nextTrack}  
      >
      </audio>
    </div>
  );
}

export default Audio;
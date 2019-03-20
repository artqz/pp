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

const useLoadedMetadata = (audio) => {
  const [duration, setDuration] = useState(0);

  const loadedMetadata = () => {
    setDuration(audio.current.duration);
  };

  useEffect(() => {  
    audio.current.addEventListener('loadedmetadata', loadedMetadata);
    return () => {
      audio.current.removeEventListener('loadedmetadata', loadedMetadata);
    };
  }, [loadedMetadata]);

  return { duration, setDuration };
}

const useUpdateProgress = (audio, togglePlay, progressMode) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(0);
  
  const updateProgress = () => {
    if (audio.current.duration > 0) {
      setCurrentTime(audio.current.currentTime);
      if(!progressMode) {
        setProgress(audio.current.currentTime / audio.current.duration * 100);
      }
      for (var i = 0; i < audio.current.buffered.length; i++) {
        if (audio.current.buffered.start(audio.current.buffered.length - 1 - i) < audio.current.currentTime) {
          setBuffer(audio.current.buffered.end(audio.current.buffered.length - 1 - i) / audio.current.duration * 100); 
          break;            
        }
      }
    }
  };

  useEffect(() => {    
    audio.current.addEventListener('timeupdate', updateProgress);
    return () => {
      audio.current.removeEventListener('timeupdate', updateProgress);
    };
  }, [togglePlay, updateProgress, progressMode]);

  return { currentTime, progress, buffer, setCurrentTime, setProgress, setBuffer };
}

const usePositionCursor = (progressMode, progressBar, setProgress) => {
  const changePositionX = (e) => {  
    if (progressMode) {    
      let progress;
      if (e.clientX > progressBar.current.clientWidth) {
        progress = 100;
      }  
      else if (e.clientX < 0) {
        progress = 0;
      }
      else {
        progress = e.clientX / progressBar.current.clientWidth * 100;
      }
      
      setProgress(progress); 
    } 
  }

  useEffect(() => {
    window.addEventListener('mousemove', changePositionX);
    return () => {
      window.removeEventListener('mousemove', changePositionX);
    }
  }, [progressMode, changePositionX]);
}

const useMouseUp = (audio, progress, duration, progressMode, setProgressMode) => {
  const stopSetProgress = () => {
    if (progressMode) {
      setProgressMode(false);
      audio.current.currentTime = progress / 100 * duration;      
    }
  }
  useEffect(() => {
    window.addEventListener('mouseup', stopSetProgress);
    return () => {
      window.removeEventListener('mouseup', stopSetProgress);
    }
  }, [progress, progressMode, stopSetProgress]);
}

function Audio(props) {
  const { player, setPlayer } = useContext(PlayerContext);
  const { link, linkLoading, setLinkLoading } = useFetch(props.path);
  const audio = useRef();  
  const progressBar = useRef();   
  const [ playing, setPlaying ] = useState(false);
  const [ muted, setMuted ] = useState(false);
  const [ progressMode, setProgressMode ] = useState(false);
  const { 
    duration, 
    setDuration 
  } = useLoadedMetadata(audio);
  const {
    canPlay, 
    setCanPlay
  } = useCanPlay(audio);
  const { 
    currentTime, 
    progress, 
    buffer, 
    setCurrentTime, 
    setProgress, 
    setBuffer 
  } = useUpdateProgress(audio, togglePlay, progressMode);

  usePositionCursor(progressMode, progressBar, setProgress);

  useMouseUp(audio, progress, duration, progressMode, setProgressMode);
  
  function togglePlay () {           
    playing ? audio.current.pause() : audio.current.play();
    setPlaying(!playing);     
  }

  function toggleMute () {           
    audio.current.muted = !muted;
    setMuted(!muted);    
  }

  function nextTrack () {   
    setLinkLoading(true);
    setCanPlay(false);
    setProgress(0);  
    setBuffer(0);   
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

  function changeProgress(e) {
    setProgress(e.clientX / progressBar.current.clientWidth * 100);
    setProgressMode(true);    
  }
  
  return (
    <div className="player">
      <ProgressBar 
        ref={progressBar}
        progress={progress} 
        buffered={buffer} 
        currentTime={currentTime}
        duration={duration}
        changeProgress={changeProgress}
      />
      <Controls
        isPlaying={playing}
        loading={canPlay}
        onPrev=''
        onNext={nextTrack}
        onPlay={togglePlay}
      />
      <div className="track_container">
        <div className="track_wrapper">{props.name}</div>
      </div>
      <div className="volume">          
        <span className="volume_btn" onClick={toggleMute}>{muted ? <i className="fas fa-volume-mute"></i> : <i className="fas fa-volume-up"></i>}</span>
      </div> 
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
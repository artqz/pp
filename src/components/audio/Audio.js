import React, { useContext, useEffect, useRef, useState } from 'react';
import { AudioContext } from '../../context/AudioContext';
import { get_track} from '../../Providers';
import Controls from './Controls';
import ProgressBar from './ProgressBar';

import './Player.css';

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

const Audio = (props) => {    
  const {state, dispatch} = useContext(AudioContext);
  const [progressMode, setProgressMode] = useState(false);

  const audio = useRef();
  const progressBar = useRef(); 

  const { 
    duration, 
    setDuration 
  } = useLoadedMetadata(audio);

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
  
  useEffect(() => {
    get_track(props.track).then(res => {      
      dispatch({
        type: 'GET_TRACK',
        link: res.data.link
      })
    });        
  }, [props.track]);

  useEffect(() => {
    if (state.playing) {  
      audio.current.play();
    }
    else {
      audio.current.pause();
    }
  }, [state.playing]);
  
  function togglePlay() {    
    dispatch({
      type: 'PLAY_TRACK',
      playing: !state.playing
    })
  }

  function onNext() {
    audio.current.pause();
    dispatch({
      type: 'NEXT_TRACK'
    });
  }

  function onPrev() {
    audio.current.pause();
    dispatch({
      type: 'PREV_TRACK'
    });
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
        isPlaying={state.playing}
        loading={true}
        onPrev={onPrev}
        onNext={onNext}
        onPlay={togglePlay}
      />
      <audio 
        ref={audio} 
        src={state.link}  
        autoPlay={state.playing}
        onEnded={onNext}
      >
      </audio>
    </div>
  );
}

export default Audio;
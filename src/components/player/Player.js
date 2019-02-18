import React, { useContext } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import Audio from './Audio';

function Player (props) {  
  const { player, setPlayer } = useContext(PlayerContext);

  function update (e) {
    console.log(e);
    setPlayer({...player, currentTime: e})
  } 
  return (
    <Audio 
      path={props.path} 
      update={update}
      currentTime={player.currentTime}
    />
  );
}
export default Player
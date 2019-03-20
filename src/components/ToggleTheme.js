import React, { useEffect, useContext } from 'react';
import { AudioContext } from '../context/AudioContext';

function ToggleTheme(props) {
  const {state, dispatch} = useContext(AudioContext);

  useEffect(() => {
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'day');
    }
    if (localStorage.getItem('theme') === 'night') {
      document.body.classList.add('night');
    }
  });

  useEffect(() => {
    dispatch({
      type: 'SWITCH_THEME',
      theme: localStorage.getItem('theme')
    });   
  }, [dispatch]);  
  
  function toggle() {
    if (localStorage.getItem('theme') === 'day') {
      localStorage.setItem('theme', 'night');
      document.body.classList.add('night');
      dispatch({
        type: 'SWITCH_THEME',
        theme: 'night'
      });
    }
    else {
      localStorage.setItem('theme', 'day');
      document.body.classList.remove('night');
      dispatch({
        type: 'SWITCH_THEME',
        theme: 'day'
      });
    }    
  }  

  return (
    <div className="switchTheme" onClick={toggle}>
      {state.theme === 'day' ? <i className="far fa-sun"></i> : <i className="far fa-moon"></i>}
    </div>
  );
}

export default ToggleTheme;
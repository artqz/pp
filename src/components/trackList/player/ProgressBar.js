import React from 'react';

const ProgressBar = React.forwardRef((props, ref) => {  
  
  return (
    <div 
      ref={ref}
      className="progress" 
      onMouseDown={e => props.changeProgress(e)}
    >
      <div className="progress_bg"></div>
      <div className="progress_bar progress_buffered">
        <div className="progress_line" style={{ width: props.buffered + '%' }}></div>
      </div>
      <div className="progress_bar progress_reproduced">
        <div className="progress_line" style={{ width: props.progress + '%' }}></div>
      </div>
      <div className="progress_bar progress_text">
        <div className="progress_left">{props.currentTime ? formatTime(props.currentTime) : null}</div>
        <div className="progress_right">{props.duration ? formatTime(props.duration) : null}</div>
      </div>
  </div>
  );  
});

function formatTime(s) {    
  const hours   = Math.floor(s / 3600);
  const minutes = Math.floor(s / 60) - hours * 60
  const seconds = Math.floor(s) - minutes * 60 - hours * 3600;

  if (hours) {
    return hours + ':' + format2Number(minutes) + ':' + format2Number(seconds)
  }
  return minutes + ':' + format2Number(seconds)
}

function format2Number(num) {
  const str = num + '';
  if (str.length === 1) {
    return '0' + str;
  }
  if (str.length === 0) {
    return '00';
  }
  return str;
}

export default ProgressBar;
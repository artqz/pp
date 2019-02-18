import React, { Component } from 'react';

class ProgressBar extends Component { 
  render () {
    const { progress, buffered, currentTime, duration } = this.props;
    
    return (
      <div 
        className="progress" 
        // onMouseDown={this.startSetProgress.bind(this)}
        // onMouseMove={this.setProgress.bind(this)}
        // onMouseLeave={this.stopSetProgress.bind(this)}
        // onMouseUp={this.stopSetProgress.bind(this)}
      >
        <div className="progress_bg"></div>
        <div className="progress_bar progress_buffered">
          <div className="progress_line" style={{ width: buffered * 100 + '%' }}></div>
        </div>
        <div className="progress_bar progress_reproduced">
          <div className="progress_line" style={{ width: progress * 100 + '%' }}></div>
        </div>
        <div className="progress_bar progress_text">
          <div className="progress_left">{currentTime ? formatTime(currentTime) : null}</div>
          <div className="progress_right">{duration ? formatTime(duration) : null}</div>
        </div>
    </div>
    );
  }
}

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
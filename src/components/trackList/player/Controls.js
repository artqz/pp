import React, { Component } from 'react';

class Controls extends Component { 
  onPrev () {
    this.props.onPrev();
  }
  onNext () {
    this.props.onNext();
  }
  onPlay () {
    this.props.onPlay();
  }
  render () {  
    const { isPlaying, loading } = this.props;  
    return (
      <div className="controls">
        <span className={loading ? 'controls_btn loading' : 'controls_btn'} onClick={this.onPrev.bind(this)}><i className="fas fa-fast-backward"></i></span>
        <span className={loading ? 'controls_btn loading' : 'controls_btn'} onClick={this.onPlay.bind(this)}>{isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}</span>          
        <span className={loading ? 'controls_btn loading' : 'controls_btn'} onClick={this.onNext.bind(this)}><i className="fas fa-fast-forward"></i></span>
      </div>
    );
  }
}

export default Controls;
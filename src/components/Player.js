import React, { Component } from 'react';
import ProgressBar from './ProgressBar';
import Controls from './Controls';
import { get_preview } from '..//Providers';
import './Player.css';

class Player extends Component { 
  constructor () {
    super();

    this.state = {
      isPlaying: false,
      progress: 0,
      buffered: 0,
      currentTime: 0,
      duration: 0,
      inSetProgressMode: false,
      muted: false,
      srcLoading: true
    }

    this.interval_id = setInterval(this.onUpdate.bind(this), 250);
  }
  componentWillReceiveProps() {
    this.setState({ srcLoading: true });
    get_preview(this.props.src).then(res => {      
      this.onChange(res.data.link);      
    });    
  }
  componentDidMount() {    
    get_preview(this.props.src).then(res => {
      this._player.src = res.data.link;
      this.setState({  srcLoading: false });      
    });    
  }
  onUpdate () {       
    if (this._player.duration > 0) {
      for (let i = 0; i < this._player.buffered.length; i++) {
        if (this._player.buffered.start(this._player.buffered.length - 1 - i) < this._player.currentTime) {
          this.setState({ buffered: this._player.buffered.end(this._player.buffered.length - 1 - i) / this._player.duration })
          break;
        }
      }
    }

    if (this.state.isPlaying) {
      if (this._player.ended) {
        this.onChange(1);        
      }
      this.setState({
        progress: this._player.currentTime / this._player.duration,
        currentTime: this._player.currentTime,
        duration: this._player.duration
      });
    }    
  }
  
  play () {   
    this.state.isPlaying ? this._player.pause() : this._player.play();
    this.setState({ isPlaying: !this.state.isPlaying });  
  }
  startSetProgress (e) {
    this.setState({ inSetProgressMode: true });
    this.setProgress(e);
  }
  stopSetProgress (e) {
    this.setState({ inSetProgressMode: false });
    this.setProgress(e);
  }
  setProgress (e) {
    if (this.state.inSetProgressMode) {
      this._player.currentTime = this._player.duration * this.state.progress;
      
      const progress = e.clientX / this.refs.progressBar.clientWidth;
      this.setState({ progress });
    }    
  }
  onChange (src) {    
    this._player.pause();
    
    this._player.src = src;    
    this.setState({ 
      progress: 0, 
      buffered: 0,
      currentTime: 0,
      duration: 0,     
      srcLoading: false
    });    

    this._player.load();
            
    if (this.state.isPlaying) {
      const playPromise = this._player.play();      
      if (playPromise !== null) {
        playPromise.catch(() => { 
          this._player.play();
        })
      }      
    } 
  }
  onMute () {    
    this._player.muted = !this.state.muted;
    this.setState({ muted: !this.state.muted });
  }
  render () {
    const { isPlaying, progress, buffered, currentTime, muted, duration, src, srcLoading } = this.state;
    const { name } = this.props;    
    console.log(this.props.currentTrack);
    
    return (
      <div className="player">
        <ProgressBar 
          progress={progress} 
          buffered={buffered} 
          currentTime={currentTime}
          duration={duration}
        />  
        <Controls
          isPlaying={isPlaying}
          loading={srcLoading}
          onPrev={this.props.onPrev}
          onNext={this.props.onNext}
          onPlay={this.play.bind(this)}
        />
        <div className="track_container">
          <div className="track_wrapper">{name}</div>
        </div>
        <div className="volume">          
          <span className="volume_btn" onClick={this.onMute.bind(this)}>{muted ? <i className="fas fa-volume-mute"></i> : <i className="fas fa-volume-up"></i>}</span>
        </div>   

        <audio 
          ref={(ref) => this._player = ref}
          src={src} 
        >
        </audio>
      </div>
    );
  }
}

export default Player;
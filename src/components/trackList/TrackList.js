import React, { useContext, useRef, useEffect } from 'react';
import { List } from 'react-virtualized'
import { AudioContext } from '../../context/AudioContext';
import 'react-virtualized/styles.css';
import './TrackList.css';

function TrackList(props) {  
  const { list } = props;
  const { state, dispatch } = useContext(AudioContext);
  const refList = useRef();

  useEffect(() => {
    refList.current.scrollToRow(state.currentTrack);
  }, [state.currentTrack]);

  function handleClick(index) {
    dispatch({
      type: 'SELECT_TRACK',
      trackId: index
    });
  }

  function rowRenderer ({
    key,         // Unique key within array of rows
    index,       // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    style        // Style object to be applied to row (to position it)
  }) {
    return (
      <div
        key={key}
        style={style}
        className={state.currentTrack === index ? 'track current_track' : 'track'}
        onDoubleClick={() => handleClick(index)}
      >
        {list[index].name}
      </div>
    )
  }
  
  return (
    <div className="track_list">
      <List
        ref={refList}
        width={400}
        height={400}
        rowCount={list.length}
        rowHeight={35}
        rowRenderer={rowRenderer}
      />
    </div>
  );
}

function Track(props) {
  const { track, index } = props;
  const { state, dispatch } = useContext(AudioContext);
  
  function handleClick() {
    dispatch({
      type: 'SELECT_TRACK',
      trackId: index
    });
  }
  
  return (
    <div className="track" onDoubleClick={handleClick}>
      {index !== state.currentTrack ? <i className="far fa-circle"></i> : <i className="far fa-play-circle"></i>} 
      <span className="track_name">{track.name}</span>
    </div>
  );
}

export default TrackList;
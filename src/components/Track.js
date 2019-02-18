import React, { Component } from 'react';

class Track extends Component { 
  render () {
    const { item } = this.props;
    return (
      <div className="track">
        <div className="track_column_id">
          <div className="track_id">1</div>
        </div>
        <div className="track_column">{item.name}</div>
      </div>
    );
  }
}

export default Track;
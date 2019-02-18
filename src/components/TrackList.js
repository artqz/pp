import React, { Component } from 'react';
import Track from './Track';

import './TrackList.css';

class TrackList extends Component { 
  render () {
    const { items } = this.props;

    return (
      <div className="track_list">
        <div className="table_head">
          <div className="table_head_column table_head_column_id">#</div>
          <div className="table_head_column table_head_column_name">Траск</div>
        </div>
        <div className="table_body">
          {items.map((item, index) => (
            <Track key={index} item={item} />
          ))}
        </div>
      </div>
    );   
  }
}

export default TrackList;
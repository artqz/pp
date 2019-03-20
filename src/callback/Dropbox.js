import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

class Dropbox extends Component { 
  componentDidMount () {
    if (this.props.location.hash !== '') {
      const accessToken = /access_token=([^&]+)/.exec(this.props.location.hash)[1];
      const tokenType = /token_type=([^&]+)/.exec(this.props.location.hash)[1];
    
      localStorage.setItem('db_access_token', accessToken);
      localStorage.setItem('db_token_type', tokenType);  
      window.location.hash = '';
    }
  }  
  
  render() {
    return <Redirect to='/'/>;
  };
}

export default Dropbox;
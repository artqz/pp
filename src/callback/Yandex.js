import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

class Yandex extends Component { 
  componentDidMount () {
    if (this.props.location.hash !== '') {
      const accessToken = /access_token=([^&]+)/.exec(this.props.location.hash)[1];
      const tokenType = /token_type=([^&]+)/.exec(this.props.location.hash)[1];
      const expiresIn = /expires_in=([^&]+)/.exec(this.props.location.hash)[1];
    
      localStorage.setItem('yd_access_token', accessToken);
      localStorage.setItem('yd_token_type', tokenType);
      localStorage.setItem('yd_expires_in', expiresIn);     
      window.location.hash = '';
    }
  }  
  
  render() {
    return <Redirect to='/'/>;
  };
}

export default Yandex;
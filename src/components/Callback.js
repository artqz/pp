import React, { Component } from 'react';

class Callback extends Component { 
  state = {
    accessToken: '',
    tokenType: '',
    expiresIn: ''
  }

  componentDidMount () {
    if (this.props.location.hash !== '') {
      const accessToken = /access_token=([^&]+)/.exec(this.props.location.hash)[1];
      const tokenType = /token_type=([^&]+)/.exec(this.props.location.hash)[1];
      const expiresIn = /expires_in=([^&]+)/.exec(this.props.location.hash)[1];
      this.setState({ accessToken, tokenType, expiresIn }); 
      localStorage.setItem('yd_access_token', accessToken);
      localStorage.setItem('yd_token_type', tokenType);
      localStorage.setItem('yd_expires_in', expiresIn);     
      window.location.hash = '';
    }
  }  
  
  render() {
    console.log(this.state);
    return (<div>123</div>);
  };
}

export default Callback;
import React from 'react';
import ToggleTheme from './ToggleTheme';

import './NavBar.css';

function NavBar() {
  const ydClientId = '7f12f06a9a954a5d8d16c1d99cae62fa';
  const ydRedirectUri = 'https://serov112.ru/yandex/callback';
  const dbRedirectUri = 'https://serov112.ru/dropbox/callback';

  const yd_token = localStorage.getItem('yd_access_token');
  const db_token = localStorage.getItem('db_access_token');
  return (
    <div className="navbar">
      <div className="logo">
        <span className="first_letter">D</span>rop
        <span className="first_letter">P</span>rop
        <span className="first_letter">P</span>lay
      </div>
      {/*!yd_token ? <a href={`https://oauth.yandex.ru/authorize?response_type=token&client_id=${ydClientId}&redirect_uri=${ydRedirectUri}`}>Яндекс</a> : null*/}
      {!db_token ? (
        <a
          href={`https://www.dropbox.com/oauth2/authorize?client_id=3sf5dug4qbt4hbf&response_type=token&redirect_uri=${dbRedirectUri}`}
        >
          Дропбокс
        </a>
      ) : null}
      <ToggleTheme />
    </div>
  );
}

export default NavBar;

import axios from 'axios';

export function yd_connect(token) {
  const config = {
    headers: {
      Authorization: token,
      Accept: 'application/json'
    }
  };
  return axios.get(
    'https://cloud-api.yandex.net/v1/disk/resources/files?media_type=audio',
    config
  );
}

export function list_folder(token, path) {
  const config = {
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json'
    }
  };
  const data = {
    path: path
  };
  return axios.post(
    'https://api.dropboxapi.com/2/files/list_folder',
    data,
    config
  );
}

export function get_track(path) {
  const config = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('db_access_token'),
      Accept: 'application/json'
    }
  };
  const data = {
    path: path
  };
  return axios.post(
    'https://api.dropboxapi.com/2/files/get_temporary_link',
    data,
    config
  );
}

export function search_mp3(path) {
  const config = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('db_access_token'),
      Accept: 'application/json'
    }
  };
  const data = {
    path: '',
    query: '*.mp3',
    start: 0,
    max_results: 1000,
    mode: 'filename'
  };
  return axios.post('https://api.dropboxapi.com/2/files/search', data, config);
}

const SET_LIST = 'SET_LIST';
const NEXT_TRACK = 'NEXT_TRACK';
const PREV_TRACK = 'PREV_TRACK';
const GET_TRACK = 'GET_TRACK';
const PLAY_TRACK = 'PLAY_TRACK';
const SELECT_TRACK = 'SELECT_TRACK';
const SWITCH_THEME = 'SWITCH_THEME';

export default (state, action) => {
  switch (action.type) {
    case SET_LIST: {
      return {               
        ...state,
        list: action.list
      };
    }
    case GET_TRACK: {
      return {
        ...state,
        link: action.link
      };
    }
    case PLAY_TRACK: {
      return {
        ...state,
        playing: action.playing
      };
    }
    case NEXT_TRACK: {
      let currentTrack;      
      if (state.list.length > state.currentTrack + 1) {
        currentTrack = state.currentTrack + 1;
      }
      else {
        currentTrack = 0;
      }
      
      return {
        ...state,
        currentTrack: currentTrack
      };      
    }
    case PREV_TRACK: {
      let currentTrack;            
      if (0 > state.currentTrack - 1) {
        currentTrack = state.list.length - 1;
      }
      else {
        currentTrack = state.currentTrack - 1;
      }
      
      return {
        ...state,
        currentTrack: currentTrack
      };      
    }
    case SELECT_TRACK: {
      return {
        ...state,
        currentTrack: action.trackId
      };      
    }
    case SWITCH_THEME: {
      return {
        ...state,
        theme: action.theme
      }; 
    }
    default:
      return state;
  }
}
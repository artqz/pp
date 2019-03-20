const GET_TRACK = 'GET_TRACK';
const PLAY_TRACK = 'PLAY_TRACK';

export default (state, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
}
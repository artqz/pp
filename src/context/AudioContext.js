import { createContext } from 'react';

export const AudioContext = createContext({
  player: {
    loading: true,
    canplay: false,
    path: null
  },
  items: []
});
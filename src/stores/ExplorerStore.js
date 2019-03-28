import React, { createContext, useReducer } from 'react';

export const ExplorerStore = createContext();

const initialState = {
  tree: {
    // '/home': {
    //   id: 0,
    //   name: 'test',
    //   path: '',
    //   isRoot: true,
    //   counter: 0,
    //   childIds: []
    // }
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NODES':
      const data = action.data;
      return {
        ...state,
        data
      };
    default:
      return state;
  }
};

export const ExplorerStoreProvider = props => {
  const [stateExplorer, dispatchExplorer] = useReducer(reducer, initialState);
  const value = { stateExplorer, dispatchExplorer };

  return (
    <ExplorerStore.Provider value={value}>
      {props.children}
    </ExplorerStore.Provider>
  );
};

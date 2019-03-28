import React from 'react';
import { ExplorerStoreProvider } from '../../stores/ExplorerStore';
import Tree from './Tree';

const Explorer = () => {
  return (
    <ExplorerStoreProvider>
      <Tree />
    </ExplorerStoreProvider>
  );
};

export default Explorer;

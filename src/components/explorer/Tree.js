import React, { useContext, useEffect, useState } from 'react';
import { ExplorerStore } from '../../stores/ExplorerStore';
import Node from './Node';
import { list_folder } from '../../Providers';

const Tree = () => {
  const { stateExplorer, dispatchExplorer } = useContext(ExplorerStore);
  const [path, setPath] = useState('');

  useEffect(() => {
    list_folder(localStorage.db_access_token, path).then(res => {
      const data = res.data.entries;
      const test = generateNodes(stateExplorer, data, path);
      dispatchExplorer({ type: 'ADD_NODES', data: test });
    });
  }, [path]);

  const generateNodes = (state, data, path) => {
    let tree = state;
    let childIds = path === '' ? [] : state[path].childIds;
    for (let i = 0; i < data.length; i++) {
      if (data[i]['.tag'] === 'folder') {
        const item = {
          id: data[i].id,
          name: data[i].name,
          path: data[i].path_lower,
          isRoot: path === '' ? true : false,
          childIds: []
        };
        console.log(childIds.indexOf(data[i].path_lower));

        if (childIds.indexOf(data[i].path_lower) === -1) {
          childIds.push(data[i].path_lower);
        }
        tree[data[i].path_lower] = item;
      }
    }
    if (path !== '') tree[path].childIds = childIds;

    return tree;
  };

  const getRootNodes = node => {
    return Object.values(stateExplorer).filter(node => node.isRoot === true);
  };

  const getChildNodes = node => {
    if (!node.childIds) return [];
    return node.childIds.map(id => stateExplorer[id]);
  };

  const openFolder = path => {
    setPath(path);
  };

  return (
    <div>
      {getRootNodes().map((node, index) => (
        <Node
          key={index}
          node={node}
          getChildNodes={getChildNodes}
          openFolder={openFolder}
        />
      ))}
    </div>
  );
};

export default Tree;

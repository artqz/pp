import React, { useEffect, useState } from 'react';
import { list_folder } from '../../Providers';

const Explorer = () => {
  const [path, setPath] = useState('');
  const [state, setState] = useState({});
  const [data, setDate] = useState([]);
  const [loading, setLoading] = useState(true);

  const treeGeneratorRoot = data => {
    const tree = {};

    for (let i = 0; i < data.length; i++) {
      if (data[i]['.tag'] === 'folder') {
        const item = {
          name: data[i].name,
          path: data[i].path_lower,
          type: data[i]['.tag'],
          isRoot: true,
          children: []
        };
        tree[data[i].path_lower] = item;
      }
    }
    return tree;
  };

  const treeGenerator = (data, state, path) => {
    if (data.length !== 0) {
      const tree = state;

      for (let i = 0; i < data.length; i++) {
        if (data[i]['.tag'] === 'folder') {
          const item = {
            name: data[i].name,
            path: data[i].path_lower,
            type: data[i]['.tag'],
            children: []
          };
          tree[data[i].path_lower] = item;
          tree[path].children = data[i].path_lower;
        }
      }
      return tree;
    }
    return state;
  };

  useEffect(() => {
    if (path === '') {
      list_folder(localStorage.db_access_token, path).then(res => {
        const data = treeGeneratorRoot(res.data.entries);
        setState(data);
      });
    } else {
      list_folder(localStorage.db_access_token, path).then(res => {
        const data = treeGenerator(res.data.entries, state, path);
        console.log(data);

        setState(data);
      });
    }
  }, [path]);

  const getRootNodes = () => {
    return Object.values(state).filter(node => node.isRoot === true);
  };

  const getChildNodes = node => {
    if (!node.children) return [];
    return node.children.map(path => state[path]);
  };

  const rootNodes = getRootNodes();
  console.log(state);

  const openFolder = path => {
    setPath(path);
  };

  return (
    <div>
      {rootNodes.map((node, index) => (
        <TreeNode
          key={index}
          level={0}
          node={node}
          getChildNodes={getChildNodes}
          openFolder={openFolder}
        />
      ))}
    </div>
  );
};

export default Explorer;

const TreeNode = ({ node, getChildNodes, level, openFolder }) => {
  const childNodes = getChildNodes(node).map((childNode, index) => (
    <TreeNode
      key={index}
      node={childNode}
      getChildNodes={getChildNodes}
      level={level + 1}
    />
  ));

  return (
    <div className="tree_node" style={{ paddingLeft: level * 5 + 'px' }}>
      <div onClick={() => openFolder(node.path)}>{node.name} 22</div>
      {childNodes}
    </div>
  );
};

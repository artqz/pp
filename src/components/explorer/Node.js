import React from 'react';

const Node = ({ node, getChildNodes, openFolder, children }) => {
  const handleClick = (e, path) => {
    e.stopPropagation();
    openFolder(path.path);
  };

  return (
    <div onClick={e => handleClick(e, node)}>
      {node.name}

      {getChildNodes(node).map(childNode => (
        <Node
          key={childNode.id}
          node={childNode}
          getChildNodes={getChildNodes}
          openFolder={openFolder}
        />
      ))}
    </div>
  );
};

export default Node;

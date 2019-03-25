import React, { useEffect, useState } from 'react';
import { list_folder } from '../../Providers';

const Explorer = () => {
  const [path, setPath] = useState('');
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [entries, setEntries] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    list_folder(localStorage.getItem('db_access_token'), path).then(res => {
      setEntries(res.data.entries);
      setLoading(false);
    });
  }, [path]);

  const handleClick = entry => {
    setPath(entry.path_display);
    setBreadcrumb(entry.path_display.split('/'));
    generator(entry.path_display);
    setLoading(true);
  };

  const goToSelectedPath = path => {
    console.log(path);

    setPath(path);
    setBreadcrumb(path.split('/'));
    setLoading(true);
  };

  const list = !loading ? (
    entries.map((entry, index) => (
      <Entry key={entry.id} entry={entry} handleClick={handleClick} />
    ))
  ) : (
    <div>loading...</div>
  );

  return (
    <div>
      <Breadcrumb breadcrumb={breadcrumb} goToSelectedPath={goToSelectedPath} />
      {list}
    </div>
  );
};

export default Explorer;

const Entry = ({ entry, handleClick }) => {
  let icon, type;
  if (entry['.tag'] === 'folder') {
    icon = <i className="fas fa-folder-open" />;
    type = 'folder';
  } else {
    icon = <i className="fas fa-file-audio" />;
    type = 'audio';
  }
  return (
    <div
      onClick={() => {
        handleClick(entry);
      }}
    >
      {icon} {entry.name}
    </div>
  );
};

const Breadcrumb = ({ breadcrumb, goToSelectedPath }) => {
  const breadcrumbList = breadcrumb.map((path, index) =>
    path === '' ? (
      <span key={index} onClick={() => goToSelectedPath('')}>
        Main
      </span>
    ) : (
      <span key={index} onClick={() => goToSelectedPath('/' + path)}>
        /{path}
      </span>
    )
  );

  return <div>{breadcrumbList}</div>;
};

const generator = path => {
  const pathArray = path.split('/');
  const breadcrumb = [];
  for (let i = 0; i < pathArray.length; i++) {
    const item = {
      name: pathArray[i] === '' ? 'Main' : pathArray[i],
      path: i === 0 ? pathArray[i] : pathArray[i - 1] + '/' + pathArray[i]
    };
    breadcrumb.push(item);
  }
  console.log(breadcrumb);
};

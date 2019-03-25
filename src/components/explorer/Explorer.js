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
      <Folder key={entry.id} folder={entry} handleClick={handleClick} />
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

const Folder = ({ folder, handleClick }) => {
  return folder['.tag'] === 'folder' ? (
    <div
      onClick={() => {
        handleClick(folder);
      }}
    >
      <i className="fas fa-folder" /> {folder.name}
    </div>
  ) : null;
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

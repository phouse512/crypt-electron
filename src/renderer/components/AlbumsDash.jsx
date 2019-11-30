import React from 'react';
import PropTypes from 'prop-types';

import Album from './albums/Album';

const AlbumsDash = ({
  albums,
  items,
  goToAlbum,
}) => {
  let albumRender;
  if (albums.length < 1) {
    albumRender = <div className="album-collection">No albums exist.</div>;
  } else {
    // perform mapping of items by album id
    const itemMap = {};
    items.forEach((obj) => {
      let existingObjs = itemMap[obj.album_id] || [];
      existingObjs.push(obj);
      itemMap[obj.album_id] = existingObjs
    });

    albumRender = <div className="album-collection">
      {albums.map(album => (
        <Album
          decryptedName={album.decryptedName}
          goToAlbum={goToAlbum}
          id={album.id}
          key={album.id}
          name={album.name}
          recentItems={itemMap[album.id] ? itemMap[album.id].slice(0, 4) : []}
          size={album.album_size}
        />
      ))}
    </div>;
  }

  return (
    <div className="album-dash">
      {albumRender}
      <div className="album-management">
        manage albums here 
      </div>
    </div>
  );
};

AlbumsDash.defaultProps = {};

AlbumsDash.PropTypes = {
  albums: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  goToAlbum: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default AlbumsDash;

import React from 'react';
import PropTypes from 'prop-types';

import Album from './albums/Album';

const AlbumsDash = ({
  albums,
  goToAlbum,
}) => {
  let albumRender;
  if (albums.length < 1) {
    albumRender = <div className="album-collection">No albums exist.</div>;
  } else {
    albumRender = <div className="album-collection">
      {albums.map(album => (
        <Album
          decryptedName={album.decryptedName}
          goToAlbum={goToAlbum}
          id={album.id}
          key={album.id}
          name={album.name}
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
  albums: PropTypes.arrayOf(PropTypes.shape({})),
  goToAlbum: PropTypes.func.isRequired,
};

export default AlbumsDash;

import React from 'react';
import PropTypes from 'prop-types';

const Album = ({
  decryptedName,
  goToAlbum,
  id,
  name,
  size,
}) => {
  let displayName = decryptedName;
  if (!decryptedName) {
    displayName = "decrypting.."
  }
  return (
    <div 
      onClick={() => goToAlbum(id)} 
      className="album-card"
    >
      {displayName} - {size}
    </div>
  );
};

Album.defaultProps = {};
Album.PropTypes = {
  decryptedName: PropTypes.string.isRequired,
  goToAlbum: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRrequired,
};

export default Album;

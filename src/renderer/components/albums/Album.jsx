import React from 'react';
import PropTypes from 'prop-types';

const Album = ({
  goToAlbum,
  id,
  name,
  size,
}) => {
  return (
    <div 
      onClick={() => goToAlbum(id)} 
      className="album-card"
    >
      {name} - {size}
    </div>
  );
};

Album.defaultProps = {};
Album.PropTypes = {
  goToAlbum: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRrequired,
};

export default Album;

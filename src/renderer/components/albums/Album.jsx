import React from 'react';
import PropTypes from 'prop-types';

const Album = ({
  decryptedName,
  goToAlbum,
  id,
  name,
  recentItems,
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
      <div className="album-card__header">
        {displayName}
        <span>{size} photo{`${size !== 1 ? 's' : ''}`}</span>
      </div>
      <div className="album-card__body">
        {recentItems.map(item => (
          <div>
            <img src={item.itemPath}/>
          </div>
        ))}
      </div>
      
    </div>
  );
};

Album.defaultProps = {};
Album.PropTypes = {
  decryptedName: PropTypes.string.isRequired,
  goToAlbum: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  recentItems: PropTypes.shape({
    id: PropTypes.number.isRequired,
    itemPath: PropTypes.string.isRequired,
  }).isRequired,
  size: PropTypes.number.isRrequired,
};

export default Album;

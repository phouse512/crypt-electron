import React from 'react';
import PropTypes from 'prop-types';

const getDisplayClass = (item) => {
  let orientationClass = 'orientation-1';
  if (item.decryptedMetadata && item.decryptedMetadata.metadata) {
    switch (item.decryptedMetadata.metadata.Orientation) {
      case 3:
        orientationClass = 'orientation-3';
        break;
      case 6:
        orientationClass = 'orientation-6';
        break;
      case 8:
        orientationClass = 'orientation-8';
        break;
      default:
        orientationClass = 'orientation-1';
    }
  }

  return orientationClass;
}

const ItemCard = ({
  item,
  openHandler,
}) => {
  const orientationClass = getDisplayClass(item);
  return (
    <div
      className={`item-card ${orientationClass}`}
      onClick={() => openHandler(item)}
    >
      <img
        src={item.itemPath}
      />
    </div>
  );
};

ItemCard.defaultProps = {
  item: {
    itemPath: undefined,
  },
};
ItemCard.PropTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    album_id: PropTypes.number.isRequired,
    hash: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    uploaded_at: PropTypes.number.isRequired,
    signed_url: PropTypes.string.isRequired,
    metadata: PropTypes.string.isRequired,
    itemPath: PropTypes.string,
  }),
  openHandler: PropTypes.func.isRequired,
}

export default ItemCard;

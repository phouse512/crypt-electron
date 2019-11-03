import React from 'react';
import PropTypes from 'prop-types';

const ItemCard = ({
  item,
  openHandler,
}) => {
  return (
    <div
      className="item-card"
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

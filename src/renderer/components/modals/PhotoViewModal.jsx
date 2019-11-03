import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

const PhotoViewModal = ({
  closeHandler,
  currentItem,
  isOpen,
  openHandler,
}) => {
  let itemView;
  if (currentItem) {
    itemView = (
      <div className="photo-view">
        <div className="photo-view__image">
          <div>
            <img src={currentItem.itemPath} />
          </div>
        </div>
        <div className="photo-view__metadata">
          metadata
        </div>
      </div>
    )
  } else {
    itemView = "No photo selected."
  }

  return (
    <ReactModal
      className="photo-modal"
      contentLabel="View Photo"
      isOpen={isOpen}
      onRequestClose={closeHandler}
    >
      {itemView}
    </ReactModal>
  );

}


PhotoViewModal.defaultProps = {};
PhotoViewModal.PropTypes = {
  closeHandler: PropTypes.func.isRequired,
  currentItem: PropTypes.shape({}).isRequired,
  isOpen: PropTypes.bool.isRequired,
  openHandler: PropTypes.func.isRequired,
};

export default PhotoViewModal;

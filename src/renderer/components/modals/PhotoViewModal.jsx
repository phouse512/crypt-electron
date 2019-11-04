import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

const PhotoViewModal = ({
  closeHandler,
  currentItem,
  isOpen,
  nextItemId,
  openHandler,
  previousItemId,
}) => {
  let itemView;
  if (currentItem) {
    itemView = (
      <div className="photo-view">
        <div 
          className="cancel-overlay"
          onClick={closeHandler}
        >
          <i className="fas fa-times"></i>
        </div>
        <div className="photo-view__change next">
          <div>
            <i className="fas fa-arrow-right"></i>
          </div>
        </div>
        <div className="photo-view__change previous">
          <div>
            <i className="fas fa-arrow-left"></i>
          </div>
        </div>
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
  nextItemId: PropTypes.number.isRequired,
  openHandler: PropTypes.func.isRequired,
  previousItemId: PropTypes.number.isRequired,
};

export default PhotoViewModal;

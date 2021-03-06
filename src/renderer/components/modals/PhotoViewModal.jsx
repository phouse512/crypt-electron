import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import moment from 'moment';

const renderMetadata = (metadataObj) => {
  let returnObj = [];
  Object.keys(metadataObj).map(key => {
    let title, value;
    switch(key) {
      case 'Timestamp':
        const momentObj = moment.unix(metadataObj[key])
        title = key;
        value = momentObj.format('MM-DD-YY HH:mm:ss');
        break;
      default:
        title = key;
        value = metadataObj[key];
    }

    returnObj.push((
      <div key={key} className="list-view__item">
        <b>{title}:</b> {value}
      </div>
    ));
  });
  return returnObj;
};

const SinglePhoto = ({ itemPath, orientation }) => {
  let orientationClass;
  switch (orientation) {
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

  return (
    <div className={orientationClass}>
      <img src={itemPath} />
    </div>
  );
};

const PhotoViewModal = ({
  changeViewMetadata,
  closeHandler,
  currentItem,
  isOpen,
  nextItemId,
  openHandler,
  previousItemId,
  viewMetadata,
}) => {
  let itemView;
  if (currentItem) {
    // render list of metadata
    let metadataList;
    let orientation = 1;
    if (currentItem.decryptedMetadata && currentItem.decryptedMetadata.metadata) {
      metadataList = renderMetadata(currentItem.decryptedMetadata.metadata);

      // set orientation if exists
      if (currentItem.decryptedMetadata.metadata.Orientation) {
        orientation = currentItem.decryptedMetadata.metadata.Orientation;
      }
    }

    itemView = (
      <div className="photo-view">
        <div 
          className="cancel-overlay"
          onClick={closeHandler}
        >
          <i className="fas fa-times"></i>
        </div>
        <div className={`info-overlay` + (viewMetadata ? ` dark` : ``)}>
          <div className="info-overlay__item">
            <i className="fas fa-arrow-left"></i>
          </div>
          <div 
            className="info-overlay__item"
            onClick={() => changeViewMetadata()}
          >
            <i className="fas fa-info-circle"></i>
          </div>
          <div className="info-overlay__item">
            <i className="fas fa-arrow-right"></i>
          </div>
        </div>
        {/* <div className="photo-view__change next">
          <div>
            <i className="fas fa-arrow-right"></i>
          </div>
        </div>
        <div className="photo-view__change previous">
          <div>
            <i className="fas fa-arrow-left"></i>
          </div>
        </div> */}
        <div className="photo-view__image">
          <SinglePhoto
            itemPath={currentItem.itemPath}
            orientation={orientation}
          />
        </div>
        { viewMetadata &&
          <div className="photo-view__metadata">
            metadata

            <div className="list-view">
              {metadataList}
            </div>
          </div>
        }
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
  changeViewMetadata: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  currentItem: PropTypes.shape({}).isRequired,
  isOpen: PropTypes.bool.isRequired,
  nextItemId: PropTypes.number.isRequired,
  openHandler: PropTypes.func.isRequired,
  previousItemId: PropTypes.number.isRequired,
  viewMetadata: PropTypes.bool.isRequired,
};

export default PhotoViewModal;

import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import AddPhotoForm from '../forms/AddPhotoForm';

const AddPhotoModal = ({
  addMetadata,
  albums,
  closeHandler,
  isOpen,
  mukObj,
  openHandler,
  saveImageRequest,
}) => (
  <ReactModal
    contentLabel="Minimal Sample Modal"
    isOpen={isOpen}
    onRequestClose={closeHandler}
  >
    <AddPhotoForm
      addMetadata={addMetadata}
      albums={albums}
      mukObj={mukObj}
      onSubmit={values => saveImageRequest({
        albumId: parseInt(values.album, 10),
        itemData: values.photoField.image,
        itemDataHash: values.photoField.encImageHash,
        itemMetadata: values.metadata,
        itemMetadataHash: "",
      })}
    />
  </ReactModal>
);

AddPhotoModal.defaultProps = {};
AddPhotoModal.PropTypes = {
  addMetadata: PropTypes.func.isRequired,
  albums: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  closeHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  mukObj: PropTypes.shape({}).isRequired,
  openHandler: PropTypes.func.isRequired,
  saveImageRequest: PropTypes.func.isRequired,
};

export default AddPhotoModal;

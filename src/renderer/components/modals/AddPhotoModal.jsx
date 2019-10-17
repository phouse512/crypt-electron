import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import AddPhotoForm from '../forms/AddPhotoForm';

const AddPhotoModal = ({
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
      mukObj={mukObj}
      onSubmit={values => saveImageRequest({
        albumId: 1,
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
  closeHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  mukObj: PropTypes.shape({}).isRequired,
  openHandler: PropTypes.func.isRequired,
  saveImageRequest: PropTypes.func.isRequired,
};

export default AddPhotoModal;

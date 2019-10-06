import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import AddPhotoForm from '../forms/AddPhotoForm';

const AddPhotoModal = ({
  closeHandler,
  isOpen,
  openHandler,
}) => (
  <ReactModal
    contentLabel="Minimal Sample Modal"
    isOpen={isOpen}
    onRequestClose={closeHandler}
  >
    <AddPhotoForm
      onSubmit={values=> console.log(values)}
    />
  </ReactModal>
);

AddPhotoModal.defaultProps = {};
AddPhotoModal.PropTypes = {
  closeHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  openHandler: PropTypes.func.isRequired,
};

export default AddPhotoModal;

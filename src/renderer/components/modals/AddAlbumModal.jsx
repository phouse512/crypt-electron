import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import AddAlbumForm from '../forms/AddAlbumForm';

const AddAlbumModal = ({
  closeHandler,
  isOpen,
  openHandler,
  saveAlbumRequest,
}) => (
  <ReactModal
    contentLabel="Create Album"
    isOpen={isOpen}
    onRequestClose={closeHandler}
  >
    <AddAlbumForm
      onSubmit={values => console.log(values)}
    />
  </ReactModal>
);

AddAlbumModal.defaultProps = {};
AddAlbumModal.PropTypes = {
  closeHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  openHandler: PropTypes.func.isRequired,
  saveAlbumRequest: PropTypes.func.isRequired,
};

export default AddAlbumModal;

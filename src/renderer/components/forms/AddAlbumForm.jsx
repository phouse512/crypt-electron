import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

const AddAlbumForm = props => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Album Name:</label>
        <Field
          component="input"
          name="name"
          placeholder="album name.."
          type="text"
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <Field
          component="input"
          name="description"
          placeholder="description.."
          type="text"
        />
      </div>
      <button type="submit">Add</button>
    </form>
  );
};

AddAlbumForm.PropTypes = {};

const AddAlbumFormRedux = reduxForm({
  form: 'addAlbum',
})(AddAlbumForm);

export default AddAlbumFormRedux;

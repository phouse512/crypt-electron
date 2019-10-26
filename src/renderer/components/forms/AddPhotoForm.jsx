import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import FieldFileInput from './FieldFileInput';
import FieldMetadataInput from './FieldMetadataInput';
import AddPhotoModal from '../modals/AddPhotoModal';

let AddPhotoForm = props => {
  const { albums, handleSubmit, invalid } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="photoField">Add Photo:</label>
        <Field
          component="select"
          name="album"
        >
          {
            albums.map(album => (
              <option
                key={album.id}
                value={album.id}
              >
                {album.name}
              </option>
            ))
          }
        </Field>
        <Field
          name="photoField"
          component={FieldFileInput}
          mukObj={props.mukObj}
        />
        <Field
          name="metadata"
          component={FieldMetadataInput}
          mukObj={props.mukObj}
        />
      </div>
      <button
        disabled={invalid}
        type="submit"
      >
        Add</button>
    </form>
  );
};

AddPhotoForm.PropTypes = {
  albums: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  mukObj: PropTypes.shape({}).isRequired,
};

const validate = values => {
  const errors = {};
  if (!values.album) {
    errors.album = 'Required.';
  }
  return errors;
}

AddPhotoForm = reduxForm({
  form: 'addPhoto',
  validate,
})(AddPhotoForm);

export default AddPhotoForm;

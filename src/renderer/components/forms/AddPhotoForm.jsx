import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import FieldFileInput from './FieldFileInput';
import FieldMetadataInput from './FieldMetadataInput';
import AddPhotoModal from '../modals/AddPhotoModal';

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <input {...input} type={type} placeholder={label} />
  </div>
);

const renderMetadata = ({ fields, meta: { error, submitFailed } }) => (
  <div>
    <div>Metadata</div>

    <button type="button" onClick={() => fields.push({})}>
      Add Keypair
    </button>
    {submitFailed && error && <span>{error}</span>}
    {fields.map((keypair, index) => (
      <div key={index}>
        <Field
          name={`${keypair}.key`}
          type="text"
          component={renderField}
          label="Key"
        />
        <Field
          name={`${keypair}.value`}
          type="text"
          component={renderField}
          label="Value"
        />
      </div>
    ))}
  </div>
);

let AddPhotoForm = props => {
  const { addMetadata, albums, handleSubmit, invalid } = props;
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
                {album.decryptedName || 'loading..'}
              </option>
            ))
          }
        </Field>
        <Field
          addMetadata={addMetadata}
          name="photoField"
          component={FieldFileInput}
          mukObj={props.mukObj}
        />
        <FieldArray
          name="metadata"
          component={renderMetadata}
        />
        {/* <Field
          name="metadata"
          component={FieldMetadataInput}
          mukObj={props.mukObj}
        /> */}
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
  addMetadata: PropTypes.func.isRequired,
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

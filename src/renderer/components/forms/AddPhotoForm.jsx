import React from 'react';
import { Field, reduxForm } from 'redux-form';

import FieldFileInput from './FieldFileInput';
import AddPhotoModal from '../modals/AddPhotoModal';

let AddPhotoForm = props => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="photoField">Add Photo:</label>
        <Field name="photoField" component={FieldFileInput} />
      </div>
      <button type="submit">Add</button>
    </form>
  );
};

AddPhotoForm = reduxForm({
  form: 'addPhoto',
})(AddPhotoForm);

export default AddPhotoForm;

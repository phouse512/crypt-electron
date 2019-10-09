import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import FieldFileInput from './FieldFileInput';
import AddPhotoModal from '../modals/AddPhotoModal';

let AddPhotoForm = props => {
  console.log(props);
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="photoField">Add Photo:</label>
        <Field 
          name="photoField" 
          component={FieldFileInput}
          mukObj={props.mukObj}
        />
      </div>
      <button type="submit">Add</button>
    </form>
  );
};

AddPhotoForm.PropTypes = {
  mukObj: PropTypes.shape({}).isRequired,
};

AddPhotoForm = reduxForm({
  form: 'addPhoto',
})(AddPhotoForm);

export default AddPhotoForm;

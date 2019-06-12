import React from 'react';
import { Field, reduxForm } from 'redux-form';

let MasterPassForm = props => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="masterpass">Master Password</label>
        <Field name="masterpass" component="input" type="password" />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

MasterPassForm = reduxForm({
  form: 'masterPass',
})(MasterPassForm);

export default MasterPassForm;

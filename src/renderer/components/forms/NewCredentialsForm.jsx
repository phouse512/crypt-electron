import React from 'react';
import { Field, reduxForm } from 'redux-form';

let NewCredentialsForm = props => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="masterPassOne">Master Password</label>
        <Field name="masterPassOne" component="input" type="password" />
      </div>
      <div>
        <label htmlFor="masterPassTwo">Retype Master Password</label>
        <Field name="masterPassTwo" component="input" type="password" />
      </div>
      <button type="submit">Set Password</button>
    </form>
  );
};

NewCredentialsForm = reduxForm({
  form: 'newCredentials',
})(NewCredentialsForm);

export default NewCredentialsForm;

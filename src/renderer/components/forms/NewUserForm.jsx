import React from 'react';
import { Field, reduxForm } from 'redux-form';

let NewUserForm = props => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <Field name="email" component="input" type="text" />
      </div>
      <div>
        <label htmlFor="username">Username:</label>
        <Field name="username" component="input" type="text" />
      </div>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <Field name="firstName" component="input" type="text" />
      </div>
      <div>
        <label htmlFor="lastName">Last Name:</label>
        <Field name="lastName" component="input" type="text" />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
};

NewUserForm = reduxForm({
  form: 'newUser',
})(NewUserForm);

export default NewUserForm;

import React from 'react';
import PropTypes from 'prop-types';

import NewUserForm from './forms/NewUserForm';

const NewUser = ({
  changeRegisterNew,
  loading,
  registerNew,
  registrationHandler,
}) => (
  <div>
    {registerNew ? (
      <div>
        <h4>Register New Account</h4>

        {loading ? (
          <p>Loading</p>
        ) : (
          <NewUserForm
            onSubmit={values => { console.log(values); registrationHandler(values.email, values.username)}}
          />
        )}

        
        <p onClick={() => changeRegisterNew(false)}>
          Click here if you already have an account.
        </p>
      </div>
      
    ) : (
      <div>
        <h4>Login Existing Account</h4>

        Steps to include.

        <p onClick={() => changeRegisterNew(true)}>
          Click here if you don't have an account.
        </p>
      </div>
    )}
  </div>
);

NewUser.defaultProps = {
  loading: false,
};

NewUser.PropTypes = {
  changeRegisterNew: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  registerNew: PropTypes.bool.isRequired,
  registrationHandler: PropTypes.bool.isRequired,
};

export default NewUser;

import React from 'react';
import PropTypes from 'prop-types';

import NewCredentialsForm from './forms/NewCredentialsForm';
import NewUserForm from './forms/NewUserForm';

const isEmpty = (object) => (
  Object.entries(object).length === 0 && object.constructor === Object
);

const NewUser = ({
  changeRegisterNew,
  generateCreds,
  loading,
  invitation,
  registerNew,
  registrationHandler,
}) => {
  if (!registerNew) {
    return (
      <div>
        <h4>Login Existing Account</h4>

        Steps to include.

        <p onClick={() => changeRegisterNew(true)}>
          Click here if you don't have an account.
        </p>
      </div>
    );
  }

  if (!isEmpty(invitation)) {
    return (
      <div>
        <h4>Register New Account</h4>
        <NewCredentialsForm
          onSubmit={values => generateCreds(
            values.masterPassOne,
          )}
        />
      </div>
    );
  }

  return (
    <div>
      <h4>Register New Account</h4>

      {loading ? (
        <p>Loading</p>
      ) : (
        <NewUserForm
          onSubmit={values => registrationHandler(
            values.email, 
            values.firstName, 
            values.lastName, 
            values.username,
          )}
        />
      )}
      
      <p onClick={() => changeRegisterNew(false)}>
        Click here if you already have an account.
      </p>
    </div>
  );
};


NewUser.defaultProps = {
  loading: false,
};

NewUser.PropTypes = {
  changeRegisterNew: PropTypes.func.isRequired,
  generateCreds: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  invitation: PropTypes.shape({}).isRequired,
  registerNew: PropTypes.bool.isRequired,
  registrationHandler: PropTypes.bool.isRequired,
};

export default NewUser;

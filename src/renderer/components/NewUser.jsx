import React from 'react';
import PropTypes from 'prop-types';

const NewUser = ({
  registerNew,
}) => (
  <div>
    {registerNew ? (
      <div>HERE's HOW TO REGISTER</div>
    ) : (
      <div>Here's how to add a new account</div>
    )}
  </div>
);

NewUser.defaultProps = {};

NewUser.PropTypes = {
  registerNew: PropTypes.bool.isRequired,
};

export default NewUser;

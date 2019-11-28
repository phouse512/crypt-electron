import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

let SearchForm = props => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div className="">
        <Field
          name="search"
          component="input"
          placeholder="search.."
          type="text"
        />
      </div>
    </form>
  );
};

SearchForm.PropTypes = {};

const validate = values => {
  return {};
}

SearchForm = reduxForm({
  form: 'searchBar',
  validate,
})(SearchForm);

export default SearchForm;

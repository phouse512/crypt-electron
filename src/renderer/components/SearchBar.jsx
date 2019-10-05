import React from 'react';
import PropTypes from 'prop-types';

const SearchBar = ({}) => {
  return (
    <div className="search-bar">
      <div className="search-section">
        Searchity Search
      </div>
      <div className="shortcut-bar">
        <i class="far fa-plus-square"></i>
      </div>
    </div>
  );
};

SearchBar.defaultProps = {};
SearchBar.PropTypes = {};

export default SearchBar;
import React from 'react';
import PropTypes from 'prop-types';

const SearchBar = ({
  openPhotoModal,
}) => {
  return (
    <div className="search-bar">
      <div className="search-section">
        Searchity Search
      </div>
      <div className="shortcut-bar">
        <i 
          className="far fa-plus-square"
          onClick={() => openPhotoModal()}
        />
      </div>
    </div>
  );
};

SearchBar.defaultProps = {};
SearchBar.PropTypes = {
  openPhotoModal: PropTypes.func.isRequired,
};

export default SearchBar;

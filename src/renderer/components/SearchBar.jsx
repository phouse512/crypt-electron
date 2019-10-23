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
        <div className="shortcut-bar__button">
          <i
            className="far fa-plus-square"
            // onClick={() => openPhotoModal()}
          />
        </div>
        <div className="shortcut-bar__content">
          <div
            onClick={() => openPhotoModal()}
          >
            Add Photo
          </div>
          <div>Add Album</div>
        </div>
      </div>
    </div>
  );
};

SearchBar.defaultProps = {};
SearchBar.PropTypes = {
  openPhotoModal: PropTypes.func.isRequired,
};

export default SearchBar;

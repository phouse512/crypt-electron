import React from 'react';
import PropTypes from 'prop-types';

import SearchForm from './forms/SearchForm';

const SearchBar = ({
  openAlbumModal,
  openPhotoModal,
}) => {
  return (
    <div className="search-bar">
      <div className="search-section">
        <SearchForm 
          onSubmit={values => console.log(values)}
        />
      </div>
      <div className="shortcut-bar">
        <div className="shortcut-bar__button">
          <i
            className="far fa-plus-square"
          />
        </div>
        <div className="shortcut-bar__content">
          <div
            onClick={() => openPhotoModal()}
          >
            Add Photo
          </div>
          <div
            onClick={() => openAlbumModal()}
          >
            Add Album
          </div>
        </div>
      </div>
    </div>
  );
};

SearchBar.defaultProps = {};
SearchBar.PropTypes = {
  openAlbumModal: PropTypes.func.isRequired,
  openPhotoModal: PropTypes.func.isRequired,
};

export default SearchBar;

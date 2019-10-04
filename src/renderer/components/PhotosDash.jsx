import React from 'react';
import PropTypes from 'prop-types';

import { paramsToFilters } from './helpers';

import PhotoFilters from './photos/PhotoFilters';


const PhotosDash = ({
  params,
  photos,
  removePhotoFilter,
}) => {
  let photoRender;
  if (photos.length < 1) {
    photoRender = <div className="photo-collection">No photos exist.</div>
  } else {
    photoRender = <div className="photo-collection">
      PHOTOS
    </div>
  }
  return (
    <div className="photo-dash">
      <PhotoFilters
        filters={paramsToFilters(params)}
        removeFilter={removePhotoFilter}
      />
      {photoRender}
      <div className="photo-management">
        manage photos here
      </div>
    </div>
  );
};

PhotosDash.defaultProps = {};
PhotosDash.PropTypes = {
  params: PropTypes.shape({}).isRequired,
  photos: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  removePhotoFilter: PropTypes.func.isRequired,
};

export default PhotosDash;
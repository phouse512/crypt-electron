import React from 'react';
import PropTypes from 'prop-types';

import { paramsToFilters } from './helpers';

import ItemCard from './photos/ItemCard';
import PhotoFilters from './photos/PhotoFilters';

const PhotosDash = ({
  albums,
  params,
  photos,
  removePhotoFilter,
}) => {
  let photoRender;
  if (photos.length < 1) {
    photoRender = <div className="photo-collection">No photos exist.</div>
  } else {
    photoRender = (
      <div className="photo-collection">
        {
          photos.map((item, idx) => (
            <ItemCard
              item={item}
              key={item.id}
            />
          ))
        }
      </div>
    );
  }

  return (
    <div className="photo-dash">
      <PhotoFilters
        filters={paramsToFilters(params)}
        filterNames={{album: albums}}
        removeFilter={removePhotoFilter}
      />
      {photoRender}
      <div className="photo-management">
        Add photos here.
      </div>
    </div>
  );
};

PhotosDash.defaultProps = {};
PhotosDash.PropTypes = {
  albums: PropTypes.shape({}),
  params: PropTypes.shape({
    album_id: PropTypes.number,
    hash: PropTypes.string,
    id: PropTypes.number,
    itemPath: PropTypes.string,
    size: PropTypes.number,
    uploaded_at: PropTypes.number,
  }).isRequired,
  photos: PropTypes.arrayOf(PropTypes.shape({
    album_id: PropTypes.number,
    hash: PropTypes.string,
    id: PropTypes.number,
    itemPath: PropTypes.string,
    size: PropTypes.number,
    uploaded_at: PropTypes.number,
  })).isRequired,
  removePhotoFilter: PropTypes.func.isRequired,
};

export default PhotosDash;
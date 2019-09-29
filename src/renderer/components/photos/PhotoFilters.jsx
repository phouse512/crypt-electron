import React from 'react';
import PropTypes from 'prop-types';

const PhotoFilters = ({
  filters,
}) => {
  return (
    <div className="photo-filters">
      <div className="">Filters</div>
      {filters.map(filterObj => (
        <div className="photo-filters__card">
          {filterObj.type} - {filterObj.value}
        </div>
      ))}
    </div>
  )
};

PhotoFilters.defaultProps = {};
PhotoFilters.PropTypes = {
  filters: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
};

export default PhotoFilters;

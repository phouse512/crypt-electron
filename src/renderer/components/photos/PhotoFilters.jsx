import React from 'react';
import PropTypes from 'prop-types';

const PhotoFilters = ({
  filters,
  removeFilter,
}) => {
  return (
    <div className="photo-filters">
      <div className="">Filters</div>
      {filters.map((filterObj, idx) => (
        <div 
          className="photo-filters__card"
          key={idx}
        >
          {filterObj.type} - {filterObj.value}
          <span
            onClick={() => removeFilter(filterObj.type, filterObj.value)}
          ><i className="fas fa-times"></i></span>
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
  removeFilter: PropTypes.func.isRequired,
};

export default PhotoFilters;

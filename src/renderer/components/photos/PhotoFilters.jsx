import React from 'react';
import PropTypes from 'prop-types';

const PhotoFilters = ({
  filters,
  filterNames,
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
          {filterObj.type} - {filterNames[filterObj.type][filterObj.value].decryptedName || 'loading..'}
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
  filterNames: PropTypes.shape({
    album: PropTypes.shape({}), // map of ids -> names
  }),
  removeFilter: PropTypes.func.isRequired,
};

export default PhotoFilters;

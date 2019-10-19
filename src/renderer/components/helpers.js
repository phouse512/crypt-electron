/*  random reducer helper methods   */

export const paramsToFilters = (params) => {
  const filters = [];
  for (var filterKey in params) {
    if (!params.hasOwnProperty(filterKey)) {
      continue;
    }

    for (var i=0; i< params[filterKey].length; i++) {
      filters.push({
        type: filterKey,
        value: params[filterKey][i],
      });
    }
  }
  return filters;
}
import { itemConstants } from '../constants';

const baseState = {
  albumIds: [],
  albums: {},
  itemIds: [],
  items: {},
};

const items = (state = baseState, action) => {
  switch (action.type) {
    case itemConstants.SET_ALBUMS:
      return Object.assign({}, state, {
        albumIds: action.albums.map(obj => obj.id),
        albums: action.albums.reduce((prev, next) => {
          prev[next.id] = next;
          return prev;
        }, {}),
      });
    default:
      return state;
  }
};

export default items;

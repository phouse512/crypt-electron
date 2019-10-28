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
    case itemConstants.SET_ITEMS:
      return Object.assign({}, state, {
        itemIds: action.items.map(obj => obj.id),
        items: action.items.reduce((prev, next) => {
          prev[next.id] = next;
          return prev;
        }, {}),
      });
    case itemConstants.SET_ITEMS_PATHS:
      return Object.assign({}, state, {
        items: state.itemIds.reduce((prev, next) => {
          const existing = state.items[next];
          prev[next] = Object.assign({}, existing, action.itemMap[next]);
          return prev;
        }, {}),
      });
    case itemConstants.SET_ALBUM_DETAILS:
      console.log(action);
      return Object.assign({}, state, {
        albums: state.albumIds.reduce((prev, next) => {
          const existing = state.albums[next];
          prev[next] = Object.assign({}, existing, action.albumMap[next]);
          return prev;
        }, {}),
      });
    default:
      return state;
  }
};

export default items;

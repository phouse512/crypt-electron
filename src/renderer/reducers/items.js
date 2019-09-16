import { itemConstants } from '../constants';

const baseState = {
  albumIds: [],
  albums: {},
  itemIds: [],
  items: {},
};

const items = (state = baseState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default items;

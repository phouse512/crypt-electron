import { itemConstants } from '../constants';

export const fetchItems = ({ albumId }) => ({
  type: itemConstants.FETCH_ITEMS_REQUEST,
  albumId,
});

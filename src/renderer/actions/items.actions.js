import { itemConstants } from '../constants';

export const fetchAlbums = () => ({
  type: itemConstants.FETCH_ALBUMS_REQUEST,
});

export const fetchItems = ({ albumId }) => ({
  type: itemConstants.FETCH_ITEMS_REQUEST,
  albumId,
});

export const setAlbums = ({ albums }) => ({
  type: itemConstants.SET_ALBUMS,
  albums,
});

export const setItems = ({ items }) => ({
  type: itemConstants.SET_ITEMS,
  items,
});

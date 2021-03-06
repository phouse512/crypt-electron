import { itemConstants } from '../constants';

export const fetchAlbums = ({ fetchItems = false }) => ({
  type: itemConstants.FETCH_ALBUMS_REQUEST,
  fetchItems,
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

export const setItemsData = ({ itemMap }) => ({
  type: itemConstants.SET_ITEMS_DATA,
  itemMap,
});

export const postAlbumRequest = ({ description, name }) => ({
  type: itemConstants.POST_ALBUM_REQUEST,
  description,
  name,
});

export const postAlbumSuccess = ({}) => ({
  type: itemConstants.POST_ALBUM_SUCCESS,
});

export const postAlbumFailure = ({}) => ({
  type: itemConstants.POST_ITEM_FAILURE,
});

export const postItemRequest = ({
  albumId,
  itemPath,
  itemMetadata,
  itemMetadataHash,
}) => ({
  type: itemConstants.POST_ITEM_REQUEST,
  albumId,
  itemPath,
  itemMetadata,
  itemMetadataHash,
});

export const postItemSuccess = ({}) => ({
  type: itemConstants.POST_ITEM_SUCCESS,
});

export const postItemFailure = ({}) => ({
  type: itemConstants.POST_ITEM_FAILURE,
});

export const setAlbumDetails = ({ albumMap }) => ({
  type: itemConstants.SET_ALBUM_DETAILS,
  albumMap,
});

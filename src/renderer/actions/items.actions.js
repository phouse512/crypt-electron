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

export const setItemsPaths = ({ itemMap }) => ({
  type: itemConstants.SET_ITEMS_PATHS,
  itemMap,
});

export const postItemRequest = ({
  albumId,
  itemData,
  itemDataHash,
  itemMetadata,
  itemMetadataHash,
}) => ({
  type: itemConstants.POST_ITEM_REQUEST,
  albumId,
  itemData,
  itemDataHash,
  itemMetadata,
  itemMetadataHash,
});

export const postItemSuccess = ({}) => ({
  type: itemConstants.POST_ITEM_SUCCESS,
});

export const postItemFailure = ({}) => ({
  type: itemConstants.POST_ITEM_FAILURE,
});

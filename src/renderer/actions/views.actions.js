import { viewConstants } from '../constants';

export const changeView = ({ view, params = {} }) => ({
  type: viewConstants.SET_VIEW,
  params,
  view,
});

export const removePhotoFilter = ({ filter, value }) => ({
  type: viewConstants.REMOVE_PHOTO_FILTER,
  filter,
  value,
});

export const changePhotoModalState = ({ newState }) => ({
  type: viewConstants.CHANGE_PHOTO_MODAL_STATE,
  newState,
});

export const changeAlbumModalState = ({ newState }) => ({
  type: viewConstants.CHANGE_ALBUM_MODAL_STATE,
  newState,
});

export const changePhotoView = ({ newState, item = {}}) => ({
  type: viewConstants.CHANGE_PHOTO_VIEW_MODAL_STATE,
  newState,
  item,
});

export const displayMetadata = () => ({
  type: viewConstants.CHANGE_PHOTO_VIEW_METADATA,
});

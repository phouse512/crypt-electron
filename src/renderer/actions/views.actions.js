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

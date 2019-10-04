import { viewConstants, viewsEnum } from '../constants';

const baseState = {
  currentView: viewsEnum.ALBUMS,
  params: {},
};

const views = (state = baseState, action) => {
  switch (action.type) {
    case viewConstants.SET_VIEW:
      return Object.assign({}, state, {
        currentView: action.view,
        params: {
          ...state.params,
          ...action.params,
        },
      });
    case viewConstants.REMOVE_PHOTO_FILTER:
      // check if type exists
      if (!state.params.hasOwnProperty(action.filter)) {
        return Object.assign({}, state, {});
      }

      // if does, see if value
      const index = state.params[action.filter].indexOf(action.value);
      if (index < 0) {
        return Object.assign({}, state, {});
      }

      state.params[action.filter].splice(index);
      return Object.assign({}, state, {
        params: state.params,
      });
    default:
      return state;
  }
};

export default views;

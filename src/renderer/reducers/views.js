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
        params: action.params,
      });
    default:
      return state;
  }
};

export default views;

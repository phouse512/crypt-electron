import { viewConstants } from '../constants';

export const changeView = ({ view, params = {} }) => ({
  type: viewConstants.SET_VIEW,
  params,
  view,
});

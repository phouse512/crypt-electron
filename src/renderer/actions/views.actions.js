import { viewConstants } from '../constants';

export const changeView = ({ view }) => ({
  type: viewConstants.SET_VIEW,
  view,
});

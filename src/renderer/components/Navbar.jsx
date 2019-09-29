import React from 'react';
import PropTypes from 'prop-types';

import { viewsEnum } from '../constants';

const Navbar = ({
  changeView,
  currentView,
}) => {
  return (
    <div className="navbar">
      <div 
        className={`navbar__item ${currentView === viewsEnum.ALBUMS ? 'navbar__item__selected' : ''}`}
        onClick={() => changeView(viewsEnum.ALBUMS)}
      >
        <div>
          <i class="fas fa-layer-group"></i>
        </div>
      </div>
      <div 
        className={`navbar__item ${currentView === viewsEnum.PHOTOS ? 'navbar__item__selected' : ''}`}
        onClick={() => changeView(viewsEnum.PHOTOS)}
      >
        <div>
          <i class="far fa-image"></i>
        </div>
      </div>
      <div
        className={`navbar__item ${currentView === viewsEnum.MANAGE ? 'navbar__item__selected' : ''}`}
        onClick={() => changeView(viewsEnum.MANAGE)}
      >
        <div>
          <i class="fas fa-tools"></i>
        </div>
      </div>
    </div>
  );
};

Navbar.defaultProps = {};

Navbar.PropTypes = {
  changeView: PropTypes.func.isRequired,
  currentView: PropTypes.string.isRequired,
};

export default Navbar;

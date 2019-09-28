import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { viewsEnum } from '../constants';
import { fetchAlbums, fetchItems } from '../actions/items.actions';

import AlbumsDash from '../components/AlbumsDash';

export class DashboardContainer extends React.Component {
  componentWillMount() {
    // fetch albums

    // fetch items]
    this.props.fetchAlbums();
    this.props.fetchItems(1);
  }

  render() {
    let viewComponent;
    switch(this.props.views.currentView) {
      case viewsEnum.ALBUMS:
        viewComponent = <AlbumsDash />;
        break;
      default:
        viewComponent = <div />;
    }

    return (
      <div className="app-container">
        <div className="app-nav">
          Test
        </div>
        <div className="app-body">
          {viewComponent}
        </div>
      </div>
    );
  }
}

DashboardContainer.propTypes = {};

const mapStateToProps = (state) => ({
  items: state.items,
  views: state.views,
});

const mapDispatchToProps = dispatch => ({
  fetchAlbums: () => dispatch(fetchAlbums()),
  fetchItems: (albumId) => dispatch(fetchItems({ albumId })),
});

const DashboardWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardContainer);

export default DashboardWrapper;
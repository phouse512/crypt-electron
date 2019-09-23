import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchAlbums, fetchItems } from '../actions/items.actions';

export class DashboardContainer extends React.Component {
  componentWillMount() {
    // fetch albums

    // fetch items]
    this.props.fetchAlbums();
    this.props.fetchItems(1);
  }

  render() {
    return (
      <div className="app-container">
        <div className="app-nav">
          Test
        </div>
        <div className="app-body">
          HI welcome to the dashboard yo.
        </div>
      </div>
    );
  }
}


DashboardContainer.propTypes = {};

const mapStateToProps = (state) => ({
  items: state.items,
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
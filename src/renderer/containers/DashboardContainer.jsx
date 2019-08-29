import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchItems } from '../actions/items.actions';

export class DashboardContainer extends React.Component {
  componentWillMount() {
    // fetch albums

    // fetch items
    this.props.fetchItems(1);
  }

  render() {
    return (
      <div>
        HI welcome to the dashboard yo.
      </div>
    );
  }
}


DashboardContainer.propTypes = {};

const mapStateToProps = (state) => ({
  items: state.items,
});

const mapDispatchToProps = dispatch => ({
  fetchItems: (albumId) => dispatch(fetchItems({ albumId })),
});

const DashboardWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardContainer);

export default DashboardWrapper;
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export class DashboardContainer extends React.Component {
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

});

const mapDispatchToProps = dispatch => ({

});

const DashboardWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardContainer);

export default DashboardWrapper;
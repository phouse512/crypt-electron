import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

export class AppWrapperComponent extends React.Component {
  componentWillMount() {
    console.log("I should check if A user is logged in.")
  }

  render() {
    return (
      <div className="container-flex">

        HELLO, checking if I exist.
      </div>
    );
  }
}

AppWrapperComponent.propTypes = {};

const mapStateToProps = ({}) => ({});
const mapDispatchToProps = dispatch => ({});

const AppWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppWrapperComponent);

export default AppWrapper;

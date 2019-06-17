import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import 'whatwg-fetch';

import { checkUserLogin, unlockAccount } from '../actions/auth.actions';
import { changeNewUser, invitationRequest } from '../actions/setup.actions';
import { isEmpty } from '../../util/object';

import MasterPassForm from '../components/forms/MasterPassForm';
import NewUser from '../components/NewUser';
import { stat } from 'fs';

export class AppWrapperComponent extends React.Component {
  componentWillMount() {
    console.log("I should check if A user is logged in.")
    this.props.checkExistingUser();
  }

  render() {
    if (this.props.newUser) {
      return (
        <div className="container-flex">
          Welcome!
          <NewUser
            changeRegisterNew={this.props.changeRegisterNew}
            loading={this.props.setup.loading}
            registerNew={this.props.registerNew}
            registrationHandler={this.props.registrationHandler}
          />
        </div>
      );
    }

    // if there is no local muk or srp data, we need to recompute
    if (!this.props.newUser && isEmpty(this.props.mukData)) {
      return (
        <div className="container-flex">
          Time to unlock, give us your master password.
          <MasterPassForm
            onSubmit={values => this.props.unlockAccount(values.masterpass)}
          />
        </div>
      )
    }

    return (
      <div className="container-flex">

        Welcome existing user!
      </div>
    );
  }
}

AppWrapperComponent.propTypes = {};

const mapStateToProps = (state) => ({
  setup: state.setup,
  registerNew: state.setup.registerNew,
  newUser: state.login.newUser,
  isLoading: state.login.isLoading,
  mukData: state.login.mukData,
  srpData: state.login.srpData,
});
const mapDispatchToProps = dispatch => ({
  changeRegisterNew: (change) => dispatch(changeNewUser(change)),
  checkExistingUser: () => dispatch(checkUserLogin()),
  registrationHandler: (email, username) => dispatch(invitationRequest({ email, username })),
  unlockAccount: (masterPass) => dispatch(unlockAccount({ masterPass })),
});

const AppWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppWrapperComponent);

export default AppWrapper;

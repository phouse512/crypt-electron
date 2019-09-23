import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore} from 'redux';
import { render } from 'react-dom';
import { HashRouter, Route, BrowserRouter } from 'react-router-dom';
import createSagaMiddleware from 'redux-saga';

import AppWrapper from './containers/AppWrapper';
import cryptApp from './reducers/index';
import initSagas from './initSagas';

import '../../stylesheets/main.scss';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  cryptApp,
  composeEnhancers(
    applyMiddleware(
      sagaMiddleware,
    ),
  )
);

initSagas(sagaMiddleware);

const App = () => (
  <AppWrapper />
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
);

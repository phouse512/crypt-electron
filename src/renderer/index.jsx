import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore} from 'redux';
import { render } from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import createSagaMiddleware from 'redux-saga';

import cryptApp from './reducers/index';
import initSagas from './initSagas';

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
  <HashRouter>
    <div>
      <h3>HELLO v2</h3>
    </div>
  </HashRouter>
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
);

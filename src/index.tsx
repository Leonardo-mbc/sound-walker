import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router';
import createHistory from 'history/createHashHistory';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import {
  ConnectedRouter,
  routerReducer as router,
  routerMiddleware,
} from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import { reducer } from './reducers';
import { rootSaga } from './sagas';
import { AppView } from './components/pages/app/app-container';

const history = createHistory();
const routerMiddlewareImpl = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({
  ...reducer,
  router,
});
const storeEnhancer = applyMiddleware(routerMiddlewareImpl, sagaMiddleware);
const composeEnhancers = composeWithDevTools({
  serialize: true,
});
const store =
  process.env.NODE_ENV === 'production'
    ? createStore(rootReducer, storeEnhancer)
    : createStore(rootReducer, composeEnhancers(storeEnhancer));

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/" component={AppView} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
);

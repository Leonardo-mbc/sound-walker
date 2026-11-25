import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes, useNavigate } from 'react-router';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from '@redux-devtools/extension';

import { reducer } from './reducers';
import { rootSaga } from './sagas';
import { AppView } from './components/pages/app/app-container';
import { AudioUtils } from './utilities/audio-utils';
import { bindNavigator } from './utilities/navigate';

const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({
  ...reducer,
});
const storeEnhancer = applyMiddleware(sagaMiddleware);
const composeEnhancers = composeWithDevTools({
  serialize: true,
});
const enhancer =
  process.env.NODE_ENV === 'production'
    ? storeEnhancer
    : composeEnhancers(storeEnhancer);
const store = createStore(rootReducer, undefined, enhancer);

sagaMiddleware.run(rootSaga);

function unlockAudio() {
  AudioUtils.instance.unlockFromUserGesture();
}

window.addEventListener('touchstart', unlockAudio, { capture: true });
window.addEventListener('touchend', unlockAudio, { capture: true });
window.addEventListener('click', unlockAudio, { capture: true });

function NavigatorBinder(): null {
  const navigate = useNavigate();
  React.useEffect(() => {
    bindNavigator(navigate);
  }, [navigate]);
  return null;
}

const container = document.getElementById('app');
if (container) {
  createRoot(container).render(
    <Provider store={store}>
      <HashRouter>
        <NavigatorBinder />
        <Routes>
          <Route path="/*" element={<AppView />} />
        </Routes>
      </HashRouter>
    </Provider>
  );
}

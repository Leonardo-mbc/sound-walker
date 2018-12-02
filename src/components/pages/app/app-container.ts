import { connect } from 'react-redux';
import { App } from './index';
import { State } from '../../../constant/initial-state';
import * as SystemAction from '../../../systems/system-actions';

import * as TWEEN from 'tween.js';

function animate() {
  TWEEN.update();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

export interface AppProps {
  setLogoTransition: (
    { isVisible, duration }: SystemAction.SetLogoTransitionPayload
  ) => void;
}

export const AppView = connect(
  (state: State) => {
    return state;
  },
  (dispatch) => {
    window.addEventListener('resize', () => {
      dispatch(
        SystemAction.setDisplayVertically(window.innerWidth, window.innerHeight)
      );
    });

    return {
      setLogoTransition: ({
        isVisible,
        duration = 2000,
      }: SystemAction.SetLogoTransitionPayload) => {
        dispatch(SystemAction.setLogoTransition({ isVisible, duration }));
      },
    };
  }
)(App);

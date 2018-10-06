import { connect } from 'react-redux';
import { App } from './index';
import { State } from '../../../constant/initial-state';
import * as SystemAction from '../../../systems/system-actions';

import * as TWEEN from 'tween.js';

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
}
requestAnimationFrame(animate);

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

    return {};
  }
)(App);

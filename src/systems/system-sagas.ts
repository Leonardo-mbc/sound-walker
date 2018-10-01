import { call, put, takeEvery, select } from 'redux-saga/effects';
import * as SystemAction from './system-actions';
import * as TitleAction from '../components/pages/title/title-actions';
import * as PlayerAction from '../components/pages/player/player-actions';
import { AudioUtils } from '../utilities/audio-utils';
import { Sound } from '../systems/system-interfaces';

const systemSaga = [
  takeEvery(SystemAction.INITIAL_RUN, function*(
    _action: SystemAction.InitialRun
  ) {
    yield put(SystemAction.createSoundsLine());
    yield put(SystemAction.loadSystemSounds());
    yield put(
      SystemAction.setDisplayVertically(window.innerWidth, window.innerHeight)
    );
  }),

  takeEvery(SystemAction.LOAD_SYSTEM_SOUNDS, function*(
    _action: SystemAction.LoadSystemSounds
  ) {
    const titleSource = yield call(async () => {
      const audioUtils = AudioUtils.instance;
      const audioBuffer = await audioUtils.loadAudioBufferFromUrl({
        url: '../assets/sounds/title.mp3',
        onProgress: (loaded: number) => {
          // どうしてもreducerを呼べないため妥協
          const loadingBar = document.getElementById('system-loading-bar');
          if (loadingBar) {
            loadingBar.style.width = `${loaded * 100.0}%`;
          }
        },
      });

      const source = audioUtils.context.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = true;

      return source;
    });

    const { system } = yield select();
    const { systemGainNode } = system.sound as Sound;
    titleSource.connect(systemGainNode);

    yield put(
      SystemAction.setSystemSource({
        key: 'title',
        bufferNode: titleSource,
      })
    );
    yield put(TitleAction.setLoadComplete());
    yield put(PlayerAction.setSystemReady(true));
  }),

  takeEvery(SystemAction.REMAKE_SYSTEM_SOUNDS, function*(
    action: SystemAction.RemakeSystemSounds
  ) {
    action.payload.bufferNode.stop(0);

    const audioUtils = AudioUtils.instance;
    const buffer = action.payload.bufferNode.buffer;
    const bufferNode = audioUtils.context.createBufferSource();
    bufferNode.buffer = buffer;

    const { system } = yield select();
    const { systemGainNode } = system.sound as Sound;
    bufferNode.connect(systemGainNode);

    if (action.payload.soonToPlay) {
      bufferNode.start(0, action.payload.startTime);
    }

    yield put(
      SystemAction.setSystemSource({
        key: action.payload.key,
        bufferNode: bufferNode,
      })
    );
  }),
];

export default systemSaga;

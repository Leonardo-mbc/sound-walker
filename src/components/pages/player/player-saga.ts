import { put, takeEvery, select, call } from 'redux-saga/effects';
import * as PlayerAction from './player-actions';
import * as SystemAction from '../../../systems/system-actions';
import { Sound } from '../../../systems/system-interfaces';
import { AudioUtils } from '../../../utilities/audio-utils';
import { request } from '../../../utilities/request';
import { PlayerState } from './player-interfaces';

const playerSaga = [
  takeEvery(PlayerAction.LOAD_MUSIC, function* (action: PlayerAction.LoadMusic) {
    yield put(SystemAction.setLoadingCircleVisible(true));

    const { url } = action.payload;
    const musicSource = yield call(async () => {
      const audioUtils = AudioUtils.instance;
      const audioBuffer = await audioUtils.loadAudioBufferFromUrl({ url });
      const source = audioUtils.context.createBufferSource();

      source.buffer = audioBuffer;
      source.loop = false;

      return source;
    });

    const { system } = yield select();
    const { systemGainNode } = system.sound as Sound;
    musicSource.connect(systemGainNode);

    yield put(PlayerAction.setMusicSource(musicSource));
    yield put(SystemAction.setLoadingCircleVisible(false));
  }),

  takeEvery(PlayerAction.START_MUSIC, function* (_action: PlayerAction.StartMusic) {
    const { player } = yield select();
    const { source } = player as PlayerState;
    source.start(0, 0);
    source.onended = (e) => {
      console.log('onended', e);
      source.stop();
    }
  }),

  takeEvery(PlayerAction.LOAD_MUSIC_INFO, function* (action: PlayerAction.LoadMusicInfo) {
    const { musicId } = action.payload;

    const scoreJson = yield call(async () => {
      const response = await request(`/scores/${musicId}.json`);
      const scoreJson = await response.json();

      return scoreJson;
    });

    yield put(PlayerAction.setMusicInfo(scoreJson));
  })
];

export default playerSaga;

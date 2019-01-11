import { initialState } from '../constant/initial-state';
import {
  ActionTypes,
  SET_SYSTEM_READY,
  CREATE_SOUNDS_LINE,
  SET_LOADING_CIRCLE_VISIBLE,
  SET_DISPLAY_VERTICALLY,
  SET_SYSTEM_SOURCE,
  SET_SAMPLE_SOURCE,
  SET_ACHIEVEMENT,
  SET_TOUCHED_FOR_PLAY,
} from './system-actions';
import { SystemState } from './system-interfaces';
import { AudioUtils } from '../utilities/audio-utils';

export function systemReducer(
  state: SystemState = initialState.system,
  action: ActionTypes
): SystemState {
  switch (action.type) {
    case SET_SYSTEM_READY:
      return {
        ...state,
        isSystemReady: action.payload.isSystemReady,
      };

    case CREATE_SOUNDS_LINE:
      const { context } = AudioUtils.instance;
      const systemGainNode = context.createGain();
      const cueAGainNode = context.createGain();
      const cueBGainNode = context.createGain();
      const analyzerNode = context.createAnalyser();
      const lowPassFilterNode = context.createBiquadFilter();
      const highPassFilterNode = context.createBiquadFilter();

      highPassFilterNode.type = 'highpass' as any;
      highPassFilterNode.frequency.value = 0;
      lowPassFilterNode.type = 'lowpass' as any;
      lowPassFilterNode.frequency.value = 44100 * 0.5;

      systemGainNode.connect(highPassFilterNode);

      // FilterNode の接続
      highPassFilterNode.connect(lowPassFilterNode);
      lowPassFilterNode.connect(analyzerNode);

      cueAGainNode.connect(analyzerNode);
      cueBGainNode.connect(analyzerNode);
      analyzerNode.connect(context.destination);

      return {
        ...state,
        sound: {
          ...state.sound,
          context,
          systemGainNode,
          cueAGainNode,
          cueBGainNode,
          analyzerNode,
          filterNode: {
            ...state.sound.filterNode,
            lowPassFilterNode,
            highPassFilterNode,
          },
          analyzerParams: {
            times: new Uint8Array(analyzerNode.frequencyBinCount),
            freqs: new Uint8Array(48),
          },
        },
      };

    case SET_SYSTEM_SOURCE:
      return {
        ...state,
        sound: {
          ...state.sound,
          sources: {
            ...state.sound.sources,
            [action.payload.key]: action.payload.bufferNode,
          },
        },
      };

    case SET_SAMPLE_SOURCE:
      return {
        ...state,
        sound: {
          ...state.sound,
          sources: {
            ...state.sound.sources,
            samples: {
              ...state.sound.sources.samples,
              [action.payload.key]: action.payload.bufferNode,
            },
          },
        },
      };

    case SET_LOADING_CIRCLE_VISIBLE:
      return {
        ...state,
        display: {
          ...state.display,
          isLoadingCircleVisible: action.payload.isVisible,
        },
      };

    case SET_DISPLAY_VERTICALLY:
      return {
        ...state,
        display: {
          ...state.display,
          isPortrait: action.payload.height <= action.payload.width,
        },
      };

    case SET_ACHIEVEMENT:
      return {
        ...state,
        achievement: action.payload.achievement,
      };

    case SET_TOUCHED_FOR_PLAY:
      return {
        ...state,
        isTouchedForPlay: action.payload.isTouchedForPlay,
      };

    default:
      return state;
  }
}

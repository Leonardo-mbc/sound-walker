import { initialState } from '../constant/initial-state';
import {
  ActionTypes,
  CREATE_SOUNDS_LINE,
  SET_LOADING_CIRCLE_VISIBLE,
  SET_DISPLAY_VERTICALLY,
  SET_SYSTEM_SOURCE,
  SET_SAMPLE_SOURCE,
} from './system-actions';
import { SystemState } from './system-interfaces';
import { AudioUtils } from '../utilities/audio-utils';

export function systemReducer(
  state: SystemState = initialState.system,
  action: ActionTypes
): SystemState {
  switch (action.type) {
    case CREATE_SOUNDS_LINE:
      const { context } = AudioUtils.instance;
      const systemGainNode = context.createGain();
      const cueAGainNode = context.createGain();
      const cueBGainNode = context.createGain();
      const analyserNode = context.createAnalyser();
      const lowPassFilterNode = context.createBiquadFilter();
      const highPassFilterNode = context.createBiquadFilter();

      systemGainNode.connect(analyserNode);
      cueAGainNode.connect(analyserNode);
      cueBGainNode.connect(analyserNode);
      analyserNode.connect(context.destination);

      return {
        ...state,
        sound: {
          ...state.sound,
          systemGainNode,
          cueAGainNode,
          cueBGainNode,
          analyserNode,
          filterNode: {
            ...state.sound.filterNode,
            lowPassFilterNode,
            highPassFilterNode,
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

    default:
      return state;
  }
}

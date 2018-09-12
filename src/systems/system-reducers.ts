import { initialState } from '../constant/initial-state';
import {
  ActionTypes,
  CREATE_SOUNDS_LINE,
  SET_TITLE_SOURCE,
  SET_LOADING_CIRCLE_VISIBLE,
  SET_DISPLAY_VERTICALLY
} from './system-actions';
import { SystemState } from './system-interfaces';
import { AudioUtils } from '../utilities/audio-utils';

export function systemReducer(state: SystemState = initialState.system, action: ActionTypes): SystemState {
  switch (action.type) {
    case CREATE_SOUNDS_LINE:
      const { context } = AudioUtils.instance;
      const systemGainNode = context.createGain();
      const analyserNode = context.createAnalyser();
      const lowPassFilterNode = context.createBiquadFilter();
      const highPassFilterNode = context.createBiquadFilter();

      systemGainNode.connect(analyserNode);
      analyserNode.connect(context.destination);

      return {
        ...state,
        sound: {
          ...state.sound,
          systemGainNode,
          analyserNode,
          filterNode: {
            ...state.sound.filterNode,
            lowPassFilterNode,
            highPassFilterNode
          }
        }
      };

    case SET_TITLE_SOURCE:
      return {
        ...state,
        sound: {
          ...state.sound,
          sources: {
            ...state.sound.sources,
            title: action.payload.titleSource
          }
        }
      }

    case SET_LOADING_CIRCLE_VISIBLE:
      return {
        ...state,
        display: {
          ...state.display,
          isLoadingCircleVisible: action.payload.isVisible
        }
      }

    case SET_DISPLAY_VERTICALLY:
      return {
        ...state,
        display: {
          ...state.display,
          isPortrait: action.payload.height <= action.payload.width
        }
      }

    default:
      return state;
  }
}

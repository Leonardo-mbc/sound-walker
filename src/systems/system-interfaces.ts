export interface SystemState {
  sound: Sound;
  display: Display;
}

export interface Sound {
  sources: SoundSources;
  context: AudioContext;
  systemGainNode: GainNode;
  cueAGainNode: GainNode;
  cueBGainNode: GainNode;
  analyzerNode: AnalyserNode;
  filterNode: FilterNode;
  analyzerParams: AnalyserParams;
}

export interface SoundSources {
  title: AudioBufferSourceNode;
  samples: {
    [key: string]: AudioBufferSourceNode;
  };
}

export interface FilterNode {
  lowPassFilterNode: BiquadFilterNode;
  highPassFilterNode: BiquadFilterNode;
  bandpassFilterNode: BiquadFilterNode;
}

export interface AnalyserParams {
  times: Uint8Array;
  freqs: Uint8Array;
}

export interface Display {
  isPortrait: boolean;
  isLoadingCircleVisible: boolean;
  logoTransition: LogoTransition;
}

interface LogoTransition {
  isVisible: boolean;
  duration: number;
}

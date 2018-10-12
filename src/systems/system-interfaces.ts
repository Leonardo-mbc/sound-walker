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
  analyserNode: AnalyserNode;
  filterNode: FilterNode;
  analyserParams: analyserParams;
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
}

export interface analyserParams {
  times: Uint8Array;
  freqs: Uint8Array;
}

export interface Display {
  isPortrait: boolean;
  isLoadingCircleVisible: boolean;
}

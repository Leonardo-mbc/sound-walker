import { singleton } from './decorators/singleton';

export interface ReadFileType {
  url: string;
  onProgress?: (loaded: number) => void;
}

@singleton
export class AudioUtils {
  static instance: AudioUtils;
  private _context: AudioContext;
  private _unlocked = false;

  constructor() {
    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextCtor) {
      throw new Error('AudioContext is not supported');
    }

    this._context = new AudioContextCtor();
  }

  get context(): AudioContext {
    return this._context;
  }

  unlockFromUserGesture() {
    const context = this._context;
    if (this._unlocked && context.state === 'running') {
      return;
    }

    if (context.state === 'suspended') {
      void context.resume();
    }

    const buffer = context.createBuffer(1, 1, context.sampleRate || 48000);
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    try {
      source.start(0);
    } catch (e) {
      // すでに再生済み、またはこの操作では開始できない
    }

    this._unlocked = true;
  }

  async loadAudioBufferFromUrl({
    url,
    onProgress,
  }: ReadFileType): Promise<AudioBuffer> {
    const audioArrayBuffer = await this._fetchArrayBuffer(url, onProgress);
    return this._decodeToBuffer(audioArrayBuffer);
  }

  private async _fetchArrayBuffer(
    url: string,
    onProgress?: (loaded: number) => void
  ) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`failed to load ${url}`);
    }

    const total = Number(response.headers.get('Content-Length')) || 0;
    if (!response.body || !total) {
      const buffer = await response.arrayBuffer();
      if (onProgress) {
        onProgress(1);
      }
      return buffer;
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let loaded = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (!value) {
        continue;
      }
      chunks.push(value);
      loaded += value.byteLength;
      if (onProgress) {
        onProgress(Math.min(loaded / total, 1));
      }
    }

    const result = new Uint8Array(loaded);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return result.buffer;
  }

  /**
   * 別コンテキストでデコードしたバッファを、再生中の AudioContext にコピーする。
   * iOS は別コンテキストのバッファを途中から再生するとノイズになる。
   */
  cloneIntoContext(buffer: AudioBuffer): AudioBuffer {
    try {
      const copy = this._context.createBuffer(
        buffer.numberOfChannels,
        buffer.length,
        buffer.sampleRate
      );
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        copy.copyToChannel(buffer.getChannelData(channel), channel);
      }
      return copy;
    } catch (error) {
      return buffer;
    }
  }

  private async _decodeToBuffer(audioArrayBuffer: ArrayBuffer) {
    const sampleRate = this._context.sampleRate || 44100;
    try {
      const offline = new OfflineAudioContext(2, 1, sampleRate);
      return await offline.decodeAudioData(audioArrayBuffer.slice(0));
    } catch (offlineError) {
      return await this._context.decodeAudioData(audioArrayBuffer.slice(0));
    }
  }
}

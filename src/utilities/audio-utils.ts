import { singleton } from "./decorators/singleton";

export interface ReadFileType {
  url: string;
  onProgress?: Function;
}

export interface ProgressParams {
  loaded: number;
  total: number;
}

@singleton
export class AudioUtils {
  static instance: AudioUtils;
  private _bufferLoader: BufferLoader;
  private _context: AudioContext;

  constructor() {
    this._bufferLoader = BufferLoader.instance;
    const agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf('safari') !== -1 && agent.indexOf('chrome') === -1) {
      // for Safari
      this._context = new webkitAudioContext();
    } else {
      this._context = new AudioContext();
    }
  }

  get context(): AudioContext {
    return this._context;
  }

  async loadAudioBufferFromUrl({ url, onProgress }: ReadFileType): Promise<AudioBuffer> {
    try {
      const audioArrayBuffer = await this._bufferLoader.getURL({ url, onProgress });
      const audioBuffer = await this._decodeToBuffer(audioArrayBuffer);
      return audioBuffer;
    } catch (e) {
      throw new Error(e);
    }
  }

  _decodeToBuffer(audioArrayBuffer: ArrayBuffer) {
    return new Promise<AudioBuffer>((resolve, reject) => {
      this._context.decodeAudioData(
        audioArrayBuffer,
        buffer => resolve(buffer),
        error => reject(`decodeAudioData error ${error}`)
      );
    });
  }
}

@singleton
class BufferLoader {
  static instance: BufferLoader;
  private _request: XMLHttpRequest;

  constructor() {
    this._request = new XMLHttpRequest();
  }

  public getURL({ url, onProgress }: ReadFileType) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      this._request.open("GET", url, true);
      this._request.responseType = "arraybuffer";

      const _onLoad = () => {
        resolve(this._request.response);
      };

      const _onProgress = ({ loaded, total }: ProgressParams) => {
        if (onProgress) {
          onProgress(loaded / total);
        }
      };

      const _onError = (e: Event) => {
        reject(e);
      };

      this._request.addEventListener("progress", _onProgress, false);
      this._request.addEventListener("load", _onLoad, false);
      this._request.addEventListener("error", _onError, false);

      this._request.send();
    });
  }
}

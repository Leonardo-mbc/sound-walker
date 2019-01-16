import { singleton } from './decorators/singleton';

@singleton
export class Browser {
  static instance: Browser;
  private _ua: string;
  private _device: string;
  private _version: number;

  get ua() {
    return this._ua;
  }
  get device() {
    return this._device;
  }
  get version() {
    return this._version;
  }

  constructor() {
    this._ua = navigator.userAgent;
    this._device = this._getDevice(this._ua);
    this._version = this._getVersion(this._ua);
  }

  _getDevice(ua: string) {
    if (/Android/.test(ua)) {
      return 'Android';
    } else if (/iP(hone|od|ad)/.test(ua)) {
      return 'iOS';
    } else {
      return 'PC';
    }
  }

  _getVersion(ua: string) {
    switch (this._getDevice(ua)) {
      case 'Android':
        return this._getAndroidVersion(ua);
        break;

      case 'iOS':
        return this._getIosVersion(ua);
        break;

      default:
        // PC or Unknown
        return null;
    }
  }

  _getAndroidVersion(ua: string) {
    return parseFloat(ua.slice(ua.indexOf('Android') + 8));
  }

  _getIosVersion(ua: string) {
    ua.match(/iP(hone|od|ad).+?OS (\w+){1,3}/g);
    return parseFloat(RegExp.$2.replace(/_/, '.').replace(/_/g, ''));
  }
}

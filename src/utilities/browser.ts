import { singleton } from './decorators/singleton';

@singleton
export class Browser {
  static instance: Browser;
  private _ua: string;
  private _device: string;
  private _version: number | null;

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

    if (this._device === 'iOS') {
      document.body.classList.add('ios');
    }
  }

  _getDevice(ua: string) {
    const isIpadDesktop =
      navigator.maxTouchPoints > 1 && /MacIntel/.test(navigator.platform);
    if (/Android/.test(ua)) {
      return 'Android';
    } else if (/iP(hone|od|ad)/.test(ua) || isIpadDesktop) {
      return 'iOS';
    } else {
      return 'PC';
    }
  }

  _getVersion(ua: string) {
    switch (this._getDevice(ua)) {
      case 'Android':
        return this._getAndroidVersion(ua);

      case 'iOS':
        return this._getIosVersion(ua);

      default:
        return null;
    }
  }

  _getAndroidVersion(ua: string) {
    const matched = ua.match(/Android (\d+(?:\.\d+)?)/);
    return matched ? parseFloat(matched[1]) : null;
  }

  _getIosVersion(ua: string) {
    const matched = ua.match(/OS (\d+)[_\.](\d+)?/);
    if (!matched) {
      return null;
    }
    return parseFloat(`${matched[1]}.${matched[2] || '0'}`);
  }
}

export class Base64 {
  static encode(str: string): string {
    return btoa(encodeURIComponent(str));
  }
  static decode(str: string): string {
    return decodeURIComponent(atob(str));
  }
}

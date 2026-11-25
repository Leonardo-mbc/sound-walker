type NavigateFn = (path: string) => void;

let navigateFn: NavigateFn | null = null;

export function bindNavigator(fn: NavigateFn) {
  navigateFn = fn;
}

export function push(path: string) {
  if (navigateFn) {
    navigateFn(path);
  }
}

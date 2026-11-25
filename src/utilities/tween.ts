import { Easing, Group, Tween as BaseTween } from '@tweenjs/tween.js';

const group = new Group();

export class Tween<T extends Record<string, any>> extends BaseTween<T> {
  constructor(object: T) {
    super(object);
    group.add(this);
  }
}

export function update(time?: number) {
  group.update(time);
}

export { Easing };

import { Base64 } from './base64';
import { Achievement } from '../systems/system-interfaces';

export type StorageParams = Achievement;

export function write({
  where,
  value,
}: {
  where: string;
  value: StorageParams;
}): void {
  const item = read({ where });
  const key: string = where;

  localStorage.setItem(
    key,
    Base64.encode(
      JSON.stringify({
        ...item,
        ...value,
      })
    )
  );
}

export function read({ where }: { where: string }): StorageParams {
  const key: string = where;
  const item = localStorage.getItem(key);

  if (item) {
    try {
      return JSON.parse(Base64.decode(item));
    } catch (e) {
      // TODO: エラー処理
    }
  } else {
    return {} as StorageParams;
  }
}

export function remove({ where }: { where: string }): StorageParams {
  const key: string = where;
  localStorage.removeItem(key);

  return {} as StorageParams;
}

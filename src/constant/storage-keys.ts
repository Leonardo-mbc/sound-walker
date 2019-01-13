interface StorageKeys {
  [index: string]: string;
}

interface WebSQLKeys {
  [index: string]: string;
}

export const STORAGE_KEYS: StorageKeys = {
  ACHIEVEMENT: 'sw-achievement-0',
  CONFIGS: 'sw-configs-0',
};

export const WEBSQL_TABLES: WebSQLKeys = {
  PLAY_LOGS: 'playLogs',
};

import { singleton } from './decorators/singleton';
import { WEBSQL_TABLES } from '../constant/storage-keys';

export interface PlayLog {
  musicId: string;
  datetime: string;
}

@singleton
export class WebSQL {
  private _version: string;
  private _db: Database;

  constructor() {
    this._version = '0.1';
    this._db = window.openDatabase(
      'sw-database',
      this._version,
      'contain play logs',
      40 * 1024 * 1024
    );

    this._db.transaction((tr) => {
      tr.executeSql(
        `CREATE TABLE IF NOT EXISTS ${
          WEBSQL_TABLES.PLAY_LOGS
        } ( musicId, datetime )`
      );
    });
  }

  query(query: string, params?: ObjectArray): Promise<SQLResultSet> {
    return new Promise((resolve, rejects) => {
      this._db.transaction((tr) => {
        tr.executeSql(
          query,
          params,
          (_transaction: SQLTransaction, resultSet: SQLResultSet) => {
            resolve(resultSet);
          },
          (_transaction: SQLTransaction, error: SQLError) => {
            rejects(error);
            return false;
          }
        );
      });
    });
  }

  insert(tableName: string, params: { [index: string]: any }) {
    const keys = Object.keys(params);
    const values = keys.map((key) => `'${params[key]}'`);
    return this.query(
      `INSERT INTO ${tableName} (${keys.join(',')}) VALUES (${values.join(
        ','
      )})`
    );
  }

  select(tableName: string, params?: { [index: string]: any }) {
    return this.query(
      `SELECT * FROM ${tableName} ${
        params
          ? `WHERE ${Object.keys(params)
              .map((key) => {
                return `${key}='${params[key]}'`;
              })
              .join(' AND ')}`
          : ''
      }`
    );
  }
}

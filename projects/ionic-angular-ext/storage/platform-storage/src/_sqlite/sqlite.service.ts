import {
  SQLiteDBConnection,
  capSQLiteChanges, capSQLiteValues, capSQLiteResult,
  DBSQLiteValues,
  SQLiteConnection
} from '@capacitor-community/sqlite';
import { QueryOptions, StorageDelegateService } from '../platform-storage';
import { QueueService } from '@ionic-angular-ext/storage/queue';

export const sqliteExtensions = 'sqlite sqlite3 db db3 s3db sl3 bak';

interface SQLiteDBConnectionCallback<T> { (myArguments: SQLiteDBConnection): T }

/**
 * This service presents functions to use capacitor-community/sqlite.
 * It implements StorageDelegateService functions in a localForage's fashion.
 * 
 * @see https://github.com/localForage/localForage/blob/master/src/drivers/websql.js
 */
export class SQLiteService implements StorageDelegateService {

  constructor(
    private _queueService: QueueService,
    private _sqliteConn: SQLiteConnection,
    public databaseName: string
  ) {
  }

  async initStore(storeName: string): Promise<any> {
    return this.executeQuery(`CREATE TABLE IF NOT EXISTS ${storeName} 
      (key TEXT(30) PRIMARY KEY, value JSON)`);
  }
  async get(key: string, storeName: string): Promise<any> {
    const resultValues = await this.executeQuery(`SELECT value FROM ${storeName} WHERE key = '${key}' LIMIT 1`);
    if (resultValues[0]) {
      return Promise.resolve(JSON.parse(resultValues[0].value));
    }
    return Promise.resolve(null);
  }
  async set(key: string, value: any, storeName: string): Promise<any> {
    return this.executeQuery(`INSERT OR REPLACE INTO ${storeName} (key, value) VALUES ('${key}','${JSON.stringify(value)}')`);
  }
  async remove(key: string, storeName: string): Promise<boolean> {
    const result = await this.executeQuery(`DELETE FROM ${storeName} WHERE key = '${key}'`);
    if(result) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
  async getAllByKeys(keys: string[], storeName: string, options?: QueryOptions): Promise<any[]> {
    if (!keys || keys.length === 0) {
      return Promise.resolve([]);
    }
    let resultValues = await this.executeQuery(`SELECT value FROM ${storeName} WHERE key IN ('${keys.join('\',\'')}')`);
    const resultObj = resultValues.map(result => JSON.parse(result.value));
    if(options?.order) {
      resultObj.sort((o0, o1) => {
        const v0 = typeof o0[options.order.orderBy] === 'string' ? 
          o0[options.order.orderBy].toLocaleLowerCase() : o0[options.order.orderBy];
        const v1 = typeof o1[options.order.orderBy] === 'string' ? 
          o1[options.order.orderBy].toLocaleLowerCase() : o1[options.order.orderBy];
        if(options.order.orderDirection === 'DESC') {
          return !v0 || v0 < v1 ? 1 : -1
        } else {
          return !v1 || v0 > v1 ? 1 : -1
        }
      });
    }
    return Promise.resolve(resultObj);
  }

  async openNewConnection(): Promise<SQLiteDBConnection> {
    try {
      await this._sqliteConn.closeConnection(this.databaseName, false);
    } catch (error) {
      console.log(error);
    }
    const dbConn = await this._sqliteConn.createConnection(this.databaseName, false, 'no-encryption', 1, false);
    await dbConn.open();
    return Promise.resolve(dbConn);
  }

  public async executeQuery(query: string): Promise<any[]> {
    /*return this.doOnTransaction<any>(async (dbConnection: SQLiteDBConnection) => {
      const res: DBSQLiteValues = await dbConnection.query(query);
      return res.values;
    }, this.databaseName);*/
    try {
      let isConnection = await this.isConnection(this.databaseName);
      let dbConn: SQLiteDBConnection;
      if (isConnection.result) {
        dbConn = await this.retrieveConnection(this.databaseName);
      } else {
        dbConn = await this._sqliteConn.createConnection(this.databaseName, false, 'no-encryption', 1, false);
        await dbConn.open();
      }
      const result: DBSQLiteValues = await dbConn.query(query);
      return result.values;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * This function will handle the sqlite isopen and isclosed automatically.
   * 
   * @param callback: The callback function that will execute multiple SQLiteDBConnection commands or other stuff.
   * @param databaseName optional another database name
   * @returns any type you want to receive from the callback function.
   */
  public async doOnTransaction<T>(callback: SQLiteDBConnectionCallback<T>, databaseName: string): Promise<T> {
    const queueInfo = this._queueService.enqueue(databaseName, callback);
    return new Promise((resolve, reject) => {
      this._queueService.executeQueue(databaseName, async (callback) => {
        try {
          let isConnection = await this.isConnection(databaseName);
          if (isConnection.result) {
            const dbConn = await this.retrieveConnection(databaseName);
            resolve(callback(dbConn));
          }
          else {
            const dbConn: SQLiteDBConnection = await this._sqliteConn.createConnection(this.databaseName, false, 'no-encryption', 1, false);
            dbConn.open();
            let result = await callback(dbConn);
            await this.closeConnection(databaseName);
            resolve(Promise.resolve(result)); 
          }
        } catch (error) {
          reject(error)
        }
      });
    }); 
  }

  /**
     * Close a connection to a database
     * @param database
     */
  async closeConnection(database: string): Promise<void> {
    return this._sqliteConn.closeConnection(database, false);
  }

  /**
   * Retrieve an existing connection to a database
   * @param database
   */
  async retrieveConnection(database: string): Promise<SQLiteDBConnection> {
      return this._sqliteConn.retrieveConnection(database, false);
  }

  /**
   * Retrieve all existing connections
   */
  async retrieveAllConnections(): Promise<Map<string, SQLiteDBConnection>> {
      return this._sqliteConn.retrieveAllConnections();
  }

  /**
   * Close all existing connections
   */
  async closeAllConnections(): Promise<void> {
      return this._sqliteConn.closeAllConnections();
  }

  /**
   * Check if connection exists
   * @param database
   */
  async isConnection(database: string): Promise<capSQLiteResult> {
      return this._sqliteConn.isConnection(database, false);
  }

  /**
   * Check Connections Consistency
   * @returns
   */
  async checkConnectionsConsistency(): Promise<capSQLiteResult> {
      return this._sqliteConn.checkConnectionsConsistency();
  }

  /**
   * Check if database exists
   * @param database
   */
  async isDatabase(database: string): Promise<capSQLiteResult> {
      return this._sqliteConn.isDatabase(database);
  }

  /**
   * Get the list of databases
   */
  async getDatabaseList(): Promise<capSQLiteValues> {
      return this._sqliteConn.getDatabaseList();
  }

  /**
   * Get Migratable databases List
   */
  async getMigratableDbList(folderPath?: string): Promise<capSQLiteValues> {
      if ( !folderPath || folderPath.length === 0 ) {
          throw new Error(`You must provide a folder path`);
      }
      return this._sqliteConn.getMigratableDbList(folderPath);
  }

  /**
   * Add "SQLite" suffix to old database's names
   */
  async addSQLiteSuffix(folderPath?: string, dbNameList?: string[]): Promise<void> {
      const path: string = folderPath ? folderPath : 'default';
      const dbList: string[] = dbNameList ? dbNameList : [];
      return this._sqliteConn.addSQLiteSuffix(path, dbList);
  }

  /**
   * Delete old databases
   */
  async deleteOldDatabases(folderPath?: string, dbNameList?: string[]): Promise<void> {
      const path: string = folderPath ? folderPath : 'default';
      const dbList: string[] = dbNameList ? dbNameList : [];
      return this._sqliteConn.deleteOldDatabases(path, dbList);
  }

  /**
   * Import from a Json Object
   * @param jsonstring
   */
  async importFromJson(jsonstring: string): Promise<capSQLiteChanges> {
      return this._sqliteConn.importFromJson(jsonstring);
  }

  /**
   * Is Json Object Valid
   * @param jsonString Check the validity of a given Json Object
   */

  async isJsonValid(jsonString: string): Promise<capSQLiteResult> {
      return this._sqliteConn.isJsonValid(jsonString);
  }

  /**
   * Copy databases from public/assets/databases folder to application databases folder
   */
  async copyFromAssets(overwrite?: boolean): Promise<void> {
      const mOverwrite: boolean = overwrite != null ? overwrite : true;
      return this._sqliteConn.copyFromAssets(mOverwrite);
  }

}

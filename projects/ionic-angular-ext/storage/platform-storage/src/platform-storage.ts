import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { Platform } from '@ionic/angular';
import { SQLiteService } from './_sqlite/sqlite.service';
import { QueueService } from '@ionic-angular-ext/storage/queue';

export const dbNotSecureKey = '==Nofw#3983oH^F%eh0g458=+3';
export const dbName = '_ligaamadora';

export interface QueryOptions {
    order?: OrderOption;
}
export interface OrderOption {
    /**
     * Shalow property used to order
     */
    orderBy: string;
    orderDirection: 'ASC' | 'DESC';
}
export interface StorageDelegateService {
    initStore(storeName: string): Promise<any>;
    set(key: string, value: any, storeName: string): Promise<any>;
    remove(key: string, storeName: string): Promise<boolean>;
    get(key: string, storeName: string): any;
    getAllByKeys(keys: string[], storeName: string, options?: QueryOptions): any[] | PromiseLike<any[]>;
}

/**
 * Delegates functions from StorageDelegateService to respective services according to platform.
 */
@Injectable()
export class PlatformStorage {

    sqlite: SQLiteConnection;
    storageDelegate: StorageDelegateService;

    constructor(
        private _platform: Platform,
        private _queueService: QueueService
    ) {}

    /**
     * Plugin Initialization
     */
    async initializePlugin(): Promise<boolean> {
        try {
            if (this._platform.is('ios') || this._platform.is('android') || this._platform.is('mobile')) {
                const sqlitePlugin = CapacitorSQLite;
                const sqliteConn = new SQLiteConnection(sqlitePlugin);
                this.storageDelegate = new SQLiteService(this._queueService, sqliteConn, dbName);
                //await this.tryClosingDetachedConnections(sqliteConn);
                await (this.storageDelegate as SQLiteService).openNewConnection();
            } else if (this._platform.is('desktop') || this._platform.is('mobileweb')) {
                throw Error('To be implemented. Probably using Dexie.');
            } else {
                throw Error('Platform not recognized');
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    initStore(storeName: string): Promise<any> {
        return this.storageDelegate?.initStore(storeName);
    }
    get(key: string, storeName: string): Promise<any> {
        return this.storageDelegate.get(key, storeName);
    }
    set(key: string, value: any, storeName: string): Promise<any> {
        return this.storageDelegate.set(key, value, storeName);
    }
    remove(key: string, storeName: string): Promise<boolean> {
        return this.storageDelegate.remove(key, storeName);
    }
    getAllByKeys(keys: string[], storeName: string, options?: QueryOptions): any[] | PromiseLike<any[]> {
        return this.storageDelegate.getAllByKeys(keys, storeName, options);
    }

    /**
     * Useful for live reloading, when sqlite cap plugin is reloaded and loses reference of any
     * available connection.
     */
    async tryClosingDetachedConnections(sqliteConn: SQLiteConnection): Promise<void> {
        try {
            await sqliteConn.closeAllConnections()
        } catch (error) {
            console.log(error);
        }
    }
}
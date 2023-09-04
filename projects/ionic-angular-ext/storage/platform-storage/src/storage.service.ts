import { Inject, Injectable } from '@angular/core';
import { QueueService } from '@ionic-angular-ext/storage/queue';
import { PlatformStorage, QueryOptions } from './platform-storage';


@Injectable()
export class StorageService {

  private _queueService: QueueService = new QueueService();

  constructor(
    @Inject(String) private _storeName: string,
    private _storage: PlatformStorage
  ) {
    this._storage.initStore(this._storeName);
  }

  public async insert(key: string, value: any) {
    const obj = await this.get(key).catch(error => {throw new Error(`Unable to get value: ${error.message}`);});
    if(obj) {
      throw new Error(`There is already a key ${key} in data storage`);
    }
    this.set(key, value);
  }

  /**
   * Given the key, adds the value to the beginning of the array/collection.
   * Optionally an 'equal' function can be provided so to avoid duplicated values in the collection.
   *
   * @return promise of resolved collection
   */
  public async add(key: string, value: any, equal?: (arg1, arg2) => boolean): Promise<boolean> {
    this._queueService.enqueue(key, {key, value, equal});
    try {
      this._queueService.executeQueue(key, async (item) => {
        let collection = await this.get(key);
        collection = collection || [];
        if(collection && !Array.isArray(collection)) {// additional check, coz any key in DB can be set to any value through function 'set'
          throw new Error('Trying to add to an object that is not a collection');
        }
        if(item.equal && item.equal instanceof Function && collection.some(item => item.equal(item, item.value))) {
          return Promise.resolve(true);
        }
        collection.unshift(item.value);
        return this.set(key, collection)
      });
    } catch (error) {
      return Promise.reject(`Couldn't add items: ${error}`);
    }
    return Promise.resolve(true);
  }

  public async removeFromIndex(indexKey: string, itemKey: any, propertyKey?: string) {
    let collection = await this.get(indexKey);
    if(collection && !Array.isArray(collection)) {
      throw new Error('Value is not a collection');
    }
    if(!collection) {
      collection = [];
    }
    if(propertyKey) {
      collection = collection.filter(item => item[propertyKey] !== itemKey);
    } else {
      collection = collection.filter(item => item !== itemKey);
    }
    return this.set(indexKey, collection).catch(err => {throw err;});
  }

  public async update(key: string, value: any): Promise<any> {
    return this.set(key, value);
  }

  async get(key: string): Promise<any> {
    return this._storage.get(key, this._storeName);
  }

  async getAllByKeys(keys: string[], options?: QueryOptions): Promise<any[]> {
    return this._storage.getAllByKeys(keys, this._storeName, options);
  }

  public async remove(key: string): Promise<boolean> {
    return this._storage.remove(key, this._storeName);
  }

  private async set(key: string, value: any): Promise<any> {
    if(!key || !value) {
      throw new Error('Key and value cannot be empty');
    }
    return Promise.resolve(this._storage.set(key, value, this._storeName));
  }

}

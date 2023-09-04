import { Injectable } from '@angular/core';

/**
 * This service uses Local Storage to store temporary data, also called here virtual data.
 * This data is limited in size and erased as soon as it is not needed.
 */
@Injectable()
export class TemporaryStorageService {

  constructor() {
  }

  /**
   * Takes a string parameter key and returns the value stored in the virtual storage against this key. 
   * If the value does not exist, it returns an empty object.
   * 
   * @param key 
   * @returns value for given key 
   */
  get(key: string): any {
    if(!key) {
      return;
    }
    let data: any; 
    try {
      data = JSON.parse(localStorage.getItem(key));
    } catch (error) {
      console.group('Virtual Storage');
      console.info(`Initializing data with key ${key}`);
      console.groupEnd();
    }
    if(!data) {
      data = {};
      localStorage.setItem(key, data);
    }
    return data;
  }

  /**
   * @param key key to collection
   * @param value value to be added
   */
  addToCollection(key: string, value: any): any[] {
    const valuesStr = localStorage.getItem(key);
    let values = [];
    if(valuesStr) {
      try {
        values = JSON.parse(valuesStr);
      } catch (error) {
        values = [];
      }
    }
    values.push(value);
    localStorage.setItem(key, JSON.stringify(values));
    return values;
  }

  /**
   * 
   * @param key key to be searched for in the storage
   * @param value object to be compared
   * @param property object's property to be compared if specified
   * @returns collection without specified element; empty collection if item not found or invalid.
   */
  removeFromCollection(key: string, value: any, property?: string): any[] {
    const valuesStr = localStorage.getItem(key);
    if(valuesStr) {
      let collection;
      try {
        collection = JSON.parse(valuesStr);
      } catch (error) {
        console.log(`Invalid Json value found for key ${key}, returning empty collection`);
        return [];
      }
      if(collection && !Array.isArray(collection)) {
        console.log(`Value for key ${key} is not an array`);
        return [];
      }
      if(property) {
        collection = collection.filter(item => item[property] !== value);
      } else {
        collection = collection.filter(item => item !== value);
      }
      localStorage.setItem(key, collection);
      return collection;
    }
    return [];
  }
  
  /**
   * Stores the provided value against the provided key in the virtual storage and returns the same value.
   * 
   * @returns value for given key
   */
  set(key: string, value: any): any {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  }

  /**
   * Performs a shallow merge between new and existing value 
   */
  merge(key: string, value: any): any {
    const existingValue = localStorage.getItem(key);
    value = Object.assign({}, existingValue, value);
    localStorage.setItem(key, value);
    return value;
  }

  delete(key: string): void {
    localStorage.removeItem(key);
  }
}

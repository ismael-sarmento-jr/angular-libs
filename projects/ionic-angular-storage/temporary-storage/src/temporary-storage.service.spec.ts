import { TestBed } from '@angular/core/testing';
import { TemporaryStorageService } from './temporary-storage.service';

describe('VirtualStorageService', () => {
  let service: TemporaryStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemporaryStorageService]
    });

    service = TestBed.inject(TemporaryStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get data from storage', () => {
    const key = 'testKey';
    const value = { name: 'John', age: 30 };
    localStorage.setItem(key, JSON.stringify(value));
    expect(service.get(key)).toEqual(value);
  });

  it('should return empty object if data does not exist', () => {
    const key = 'nonExistentKey';
    expect(service.get(key)).toEqual({});
  });

  describe(':: add to collection ::', () => {

    it('should add value to empty collection', () => {
        const key = 'collectionKey';
        const value1 = { name: 'John', age: 30 };
        service.set(key, []);
        expect(service.addToCollection(key, value1)).toEqual([value1]);
    });

    it('should add value to existing collection', () => {
        const key = 'collectionKey';
        const value1 = { name: 'John', age: 30 };
        const value2 = { name: 'Jane', age: 25 };
        localStorage.setItem(key, JSON.stringify([value1]));
        expect(service.addToCollection(key, value2)).toEqual([value1, value2]);
    });
  });

  describe(':: remove from collection ::', () => {

    it('should remove an item from the collection', () => {
      const key = 'testKey';
      const collection = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
      localStorage.setItem(key, JSON.stringify(collection));
      const result = service.removeFromCollection(key, 1, 'id');
      expect(result).toEqual([{ id: 2, name: 'Jane' }]);
    });

    it('should remove an item from the collection without a property', () => {
      const key = 'testKey';
      const collection = ['apple', 'banana', 'orange'];
      localStorage.setItem(key, JSON.stringify(collection));

      const result = service.removeFromCollection(key, 'banana');
      expect(result).toEqual(['apple', 'orange']);
    });

    it('should return an empty array if the key is not found', () => {
      const key = 'nonExistentKey';
      const result = service.removeFromCollection(key, 1, 'id');
      expect(result).toEqual([]);
    });

    it('should return an empty array if the collection is not an array', () => {
      const key = 'testKey';
      const invalidCollection = 'invalidCollection';
      localStorage.setItem(key, invalidCollection);

      const result = service.removeFromCollection(key, 1, 'id');
      expect(result).toEqual([]);
    });

    it('should return an empty array if the JSON value is invalid', () => {
      const key = 'testKey';
      const invalidJson = '{invalidJson}';
      localStorage.setItem(key, invalidJson);

      const result = service.removeFromCollection(key, 1, 'id');
      expect(result).toEqual([]);
    });
  });

  it('should set data in storage', () => {
    const key = 'testKey';
    const value = { name: 'John', age: 30 };
    service.set(key, value);
    expect(localStorage.getItem(key)).toEqual(JSON.stringify(value));
  });

  it('should delete data from storage', () => {
    const key = 'testKey';
    const value = { name: 'John', age: 30 };
    localStorage.setItem(key, JSON.stringify(value));
    service.delete(key);
    expect(localStorage.getItem(key)).toBeNull();
  });
});

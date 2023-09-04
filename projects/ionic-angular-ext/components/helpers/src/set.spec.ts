import { defaultEquals, pushObjectToSet } from './set';

describe('Unit Test Set::', () => {

    describe('Push to set ::', () => {
        let set: any[];
  
        beforeEach(() => {
            set = [];
        });

        it('should add an object to the set if it is not already in the set', () => {
            const obj = { name: 'John', age: 30 };
            const result = pushObjectToSet(obj, set);
            expect(result).toBe(0);
            expect(set.length).toBe(1);
            expect(set[0]).toBe(obj);
        });

        it('should not add an object to the set if it is already in the set', () => {
            const obj1 = { name: 'John', age: 30 };
            const obj2 = { name: 'John', age: 30 };
            pushObjectToSet(obj1, set);
            const result = pushObjectToSet(obj2, set);
            expect(result).toBe(0);
            expect(set.length).toBe(1);
            expect(set[0]).toBe(obj1);
        });

        it('should use the equals function to determine if two objects are equal', () => {
            const obj1 = { name: 'John', age: 30 };
            const obj2 = { name: 'John', age: 30 };
            const equals = (obj1: any, obj2: any) => obj1.name === obj2.name;
            pushObjectToSet(obj1, set, {equals});
            const result = pushObjectToSet(obj2, set, {equals});
            expect(result).toBe(0);
            expect(set.length).toBe(1);
            expect(set[0]).toBe(obj1);
        });

        it('should use the default equals function if no equals function is provided', () => {
            const obj1 = { name: 'John', age: 30 };
            const obj2 = { name: 'John', age: 30 };
            const obj3 = { name: 'Jane', age: 25 };
            pushObjectToSet(obj1, set);
            pushObjectToSet(obj2, set);
            const result = pushObjectToSet(obj3, set);
            expect(result).toBe(1);
            expect(set.length).toBe(2);
            expect(set[1]).toBe(obj3);
        });

        it('should add an object to the start of the set if position is "start"', () => {
            const obj = { name: 'John', age: 30 };
            const options = { position: 'start' };
            const result = pushObjectToSet(obj, set, {position: 'start'});
            expect(result).toBe(0);
            expect(set.length).toBe(1);
            expect(set[0]).toBe(obj);
        });
    });

    describe('Default Equals ::', () => {

        it('should return true on same simple objects', () => {
            const a = {};
            expect(defaultEquals(a,a)).toBeTrue();
            expect(defaultEquals('a','a')).toBeTrue();
            expect(defaultEquals(0,0)).toBeTrue();
            expect(defaultEquals(true,true)).toBeTrue();
            expect(defaultEquals(null,null)).toBeTrue();
            expect(defaultEquals(undefined,undefined)).toBeTrue();
        });

        it('should return false on different simple objects', () => {
            expect(defaultEquals('a','b')).toBeFalse();
            expect(defaultEquals(0,1)).toBeFalse();
            expect(defaultEquals(true,false)).toBeFalse();
            expect(defaultEquals(null,undefined)).toBeFalse();
        });

        it('should return false on different complex objects', () => {
            expect(defaultEquals({a:'a'},{a:'b'})).toBeFalse();
            expect(defaultEquals({a:'a'},{a:{a:'a'}})).toBeFalse();
            expect(defaultEquals({a:'a'},{b:'a'})).toBeFalse();
            expect(defaultEquals({a:'a',b:'b'},{a:'a'})).toBeFalse();
            expect(defaultEquals({a:{c:'c'}},{a:{c:'b'}})).toBeFalse();
            expect(defaultEquals({a:{c:'c'}, b:{d:'d'}},{a:{c:'c'},b:{d:null}})).toBeFalse();
            expect(defaultEquals({a:{c:{d:'d'}}},{a:{c:{d:'e'}}})).toBeFalse();
        });

        it('should return true on equal complex objects', () => {
            expect(defaultEquals({a:'a',b:{}},{a:'a', b:{}})).toBeTrue();
            expect(defaultEquals({a:'a',b:null},{a:'a', b:null})).toBeTrue();
            expect(defaultEquals({a:'a',b:undefined},{a:'a', b:undefined})).toBeTrue();
            expect(defaultEquals({a:'a',b:'b'},{a:'a', b:'b',c:'c'})).toBeTrue();
            expect(defaultEquals({a:{c:'c'}},{a:{c:'c'}})).toBeTrue();
            expect(defaultEquals({a:{c:'c'}, b:{d:'d'}},{a:{c:'c'},b:{d:'d'}})).toBeTrue();
            expect(defaultEquals({a:{c:{d:'d'}}},{a:{c:{d:'d'}}})).toBeTrue();});
    });
});
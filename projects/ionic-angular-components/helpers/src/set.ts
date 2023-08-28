export interface PushOptions {
    equals?: (obj1: any, obj2: any) => boolean;
    position?: 'start' | 'end';
}

/**
 * 
 * @param obj object to be added
 * @param set collection of elements to add to
 * @param options PushOptions
 * @returns position to which the element was added or position where it was at if already present 
 */
export const pushObjectToSet = <T>(obj: T, set: T[], options?: PushOptions): number => {
    const equals = options?.equals && options.equals instanceof Function ? 
        options.equals : defaultEquals;
    const foundAt = set.findIndex(item => equals(item, obj));
    if(foundAt != null && foundAt >= 0) {
        return foundAt;
    } else if(options?.position === 'start') {
        set.unshift(obj);
        return 0;
    } else {
        return set.push(obj) - 1;
    }
}

/**
 * Notice objects don't need to have the same properties to be equals here, all that 
 * is needed is that obj2 has the same values for each property in obj1. 
 *
 * @param obj1 
 * @param obj2 
 * @returns 
 */
export const defaultEquals = (obj1: any, obj2: any): boolean => {
     if(obj1 === obj2) {
        return true;
     }
     if(!(obj1 instanceof Object) || !(obj2 instanceof Object)){
        return false;
     }
     for (let key in obj1) {
        if(!obj2.hasOwnProperty(key)) {
            return false;
        }
        if(!defaultEquals(obj1[key], obj2[key])) {
            return false;
        }
     };
     return true;
}
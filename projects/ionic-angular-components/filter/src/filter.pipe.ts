import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  /**
   * If list is defined, filter in items which contain filterValue.
   *
   * @param filterValue
   *    input to be compared with item's property
   * @param property
   *    property to be compared with filterValue
   * @returns filtered list
   */
  transform(items: any[], property: string, filterValue: string): any[] {
    if(!items){
      return [];
    }
    if(!filterValue) {
      return items;
    }
    filterValue = filterValue.toLowerCase();
    return items.filter( item => item[property].toLowerCase().includes(filterValue));
  }
}

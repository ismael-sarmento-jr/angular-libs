import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slice'
})
export class SlicePipe implements PipeTransform {

  transform(items: any[], limit: number): any[] {
    if(!items || items.length === 0 || !limit) {
      return items;
    } else {
      return items.slice(0, limit);
    }
  }

}

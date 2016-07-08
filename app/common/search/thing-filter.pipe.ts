import { Pipe, PipeTransform } from '@angular/core';
import { filter, chain } from 'lodash';
@Pipe({
  name: 'SearchFilter'
})

export class SearchFilter implements PipeTransform {
  public transform(...args:any[]):any {
    let [value, text, field, inside] = args;

    if (!text) {
      return value;
    }

    let newItems:any[];

    if (!inside) {
      newItems = filter(value, (item:any) => {
        return field ? !item.empty && item.country.toLowerCase().indexOf(text.toLowerCase()) !== -1 : true;
      });
    }

    if (inside) {
      newItems = chain(value)
        .map((item:any) => {
          return {
            _id: item._id,
            things: chain(item.things)
              .filter((thing:any) => {
                return !thing.empty && thing.name.toLowerCase().indexOf(text.toLowerCase()) !== -1;
              }).value()
          };
        })
        .filter((item:any) => {
          return item.things.length;
        })
        .value();
    }

    return newItems;
  }
}

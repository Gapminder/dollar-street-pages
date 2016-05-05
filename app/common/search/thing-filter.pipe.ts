import {Pipe} from '@angular/core';
import {filter, chain} from 'lodash';
let _ = require('lodash');
@Pipe({
  name: 'SearchFilter'
})

export class SearchFilter {
  transform(...args:any[]) {
    let [value, text, field, inside] = args;
    if (!text) {
      return value;
    }
    let newItems:any[];

    if (!inside) {
      newItems = filter(value, (item:any) => {
        return field ? item.country.toLowerCase().indexOf(text.toLowerCase()) !== -1 : true;
      });
    }

    if (inside) {
      newItems = chain(value)
        .map((item) => {
          return {
            _id: item._id,
            things: chain(item.things)
              .filter((thing) => {
                return thing.name.toLowerCase().indexOf(text.toLowerCase()) !== -1;
              }).value()
          };
        })
        .filter((item) => {
          return item.things.length;
        })
        .value();
    }

    return newItems;
  }
}

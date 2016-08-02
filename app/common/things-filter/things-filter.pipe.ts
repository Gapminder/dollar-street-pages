import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'lodash';

interface Thing {
  _id:string;
  empty:boolean;
  icon:string;
  plural:string;
  thingCategory:string[];
  thingName:string;
}

@Pipe({
  name: 'ThingsFilterPipe'
})

export class ThingsFilterPipe implements PipeTransform {
  public transform(...args:any[]):any {
    let [value, text] = args;

    if (!text) {
      return value;
    }

    return filter(value, (item:Thing) => {
      console.log('jhfjjfjf',item)
      return !item.empty && item.plural.toLowerCase().indexOf(text.toLowerCase()) !== -1;
    });
  }
}

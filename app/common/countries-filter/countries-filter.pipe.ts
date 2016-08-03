import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'lodash';

interface Country {
  _id:string;
  empty:boolean;
  country:any;
}

@Pipe({
  name: 'CountriesFilterPipe'
})

export class CountriesFilterPipe implements PipeTransform {
  public transform(...args:any[]):any {
    let [value, text] = args;

    if (!text) {
      return value;
    }

    return filter(value, (item:Country) => {
      return !item.empty && item.country.toLowerCase().indexOf(text.toLowerCase()) !== -1;
    });
  }
}

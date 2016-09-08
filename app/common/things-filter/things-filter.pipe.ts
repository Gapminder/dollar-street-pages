import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'lodash';

interface Thing {
  _id: string;
  empty: boolean;
  icon: string;
  plural: string;
  thingCategory: string[];
  synonymous: {text: string}[];
  thingName: string;
}

@Pipe({
  name: 'ThingsFilterPipe'
})

export class ThingsFilterPipe implements PipeTransform {
  public transform(...args: any[]): any {
    let [value, text] = args;

    if (!text) {
      return value;
    }

    return filter(value, (item: Thing) => {
      let synonymous = filter(item.synonymous, (synonym: {text: string}) => {
        return synonym.text.toLowerCase().indexOf(text.toLowerCase()) !== -1;
      });

      return !item.empty && (synonymous.length || item.plural.toLowerCase().indexOf(text.toLowerCase()) !== -1);
    });
  }
}

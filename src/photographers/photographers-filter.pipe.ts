import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'PhotographersFilter'
})
export class PhotographersFilterPipe implements PipeTransform {
  public transform(...args: any[]): any[] {
    let [value, text, countries, nested] = args;
    let photographersArr: any[] = [];

    countries = JSON.parse(JSON.stringify(countries));

    if (!text) {
      return value;
    }

    let items: any = value;
    let newItems: any;

    newItems = countries.filter((country: any) => {
      let photographers = country.photographers.filter((photographer: any) => {
        return photographer.name.toLowerCase().indexOf(text.toLowerCase()) !== -1;
      });

      if (photographers.length) {
        photographersArr.push(...photographers.map((photographer: any) => {
          return photographer.name;
        }));

        country.photographers = photographers;

        return country;
      }

      if (country.name.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
        photographersArr.push(...country.photographers.map((photographer: any) => {
          return photographer.name;
        }));

        return true;
      }

      return false;
    });

    if (!nested) {
      newItems = items.filter((photographer: any) => {
        return photographersArr.indexOf(photographer.name) !== -1;
      });
    }

    return newItems;
  }
}

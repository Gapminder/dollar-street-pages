import {Pipe} from '@angular/core';

@Pipe({
  name: 'PhotographersFilter'
})

export class PhotographersFilter {
  transform(...args:any[]) {
    let [value, text, countries, nested] = args;
    let photographersArr = [];
    countries = JSON.parse(JSON.stringify(countries));

    if (!text) {
      return value;
    }

    var items:any = value;
    var newItems:any;

    newItems = countries.filter(country => {
      let photographers = country.photographers.filter(photographer => {
        return photographer.name.toLowerCase().indexOf(text.toLowerCase()) !== -1;
      });

      if (photographers.length) {
        photographersArr.push(...photographers.map((photographer) => {
          return photographer.name;
        }));

        country.photographers = photographers;

        return country;
      }

      if (country.name.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
        photographersArr.push(...country.photographers.map((photographer) => {
          return photographer.name;
        }));

        return true;
      }

      return false;
    });

    if (!nested) {
      newItems = items.filter((photographer) => {
        return photographersArr.indexOf(photographer.name) !== -1;
      });
    }

    return newItems;
  }
}
